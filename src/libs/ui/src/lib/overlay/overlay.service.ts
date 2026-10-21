import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, createComponent, DestroyRef, EmbeddedViewRef, EnvironmentInjector, inject, Injectable, Injector, PLATFORM_ID, signal, TemplateRef, Type } from '@angular/core';
import { ShyOverlayConfig, ShyOverlayContext, ShyRect } from '../interfaces/overlay/overlay.interface';
import { ShyOverlayLayer } from '../types/overlay/overlay.type';
import { animateOut } from '../utils/animate-out';
import { ru } from '../utils/ru';
import { focusInitial, restoreFocus, trapTab } from './focus-scope';
import { layerRank } from './layers';
import { SHY_OVERLAY_DATA, ShyOverlayRef } from './overlay-ref';
import { computePosition } from './position';

/** O serviço guarda refs de vários `R`/`C`; `any` evita a invariância do `resolveClosed`. */
type AnyOverlayRef = ShyOverlayRef<any, any>;

interface Entry {
  ref: AnyOverlayRef;
  pane: HTMLElement;
  config: ShyOverlayConfig;
  rank: number;
  modal: boolean;
  /** `[popover]` (promovível) em vez de `<dialog>`. */
  popover: boolean;
  /** `<dialog>` ou popover realmente no top layer; `false` nos navegadores sem a API (fallback `position: fixed` + `z()`). */
  topLayer: boolean;
  previousFocus: Element | null;
  backdrop: HTMLElement | null;
  destroyContent: () => void;
  onKeydown: ((event: Event) => void) | null;
}

const DEFAULT_OFFSET = 2;
const DEFAULT_PADDING = 2;

/**
 * Abre componentes e templates em camadas sobre a página (plano 7.5 e 11.2; ADR-F0-7, F4-1 e F4-4).
 *
 * - `open(ComponenteOuTemplate, config)` devolve um `ShyOverlayRef` (`close(result)`, `closed`, `isOpen`, `updatePosition()`).
 * - Os painéis moram em `.shy-overlay-container` (no `body`), criado no primeiro overlay e removido quando o último some.
 * - Modal/drawer usam `<dialog>.showModal()`; o resto usa `[popover="manual"]`. Ambos vão para o top layer, onde vale a ordem
 *   de abertura: ao abrir um overlay, popover/tooltip/toast de camada mais alta são promovidos (`data-promoting`, sem animação).
 * - Sem a API (navegadores antigos) o painel fica em `position: fixed` com `z-index` de `--shy-z-*`.
 * - Esc fecha só a camada do topo; clique fora é configurável; modal trava o scroll da página e prende o Tab.
 */
@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly doc = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Abertos e não em saída, do mais antigo ao mais novo (o último é o topo). */
  private readonly stack: Entry[] = [];
  /** Tudo que ainda tem painel no DOM (inclui os em animação de saída). */
  private readonly live = new Set<Entry>();
  private container: HTMLElement | null = null;
  private listening = false;
  private scrollLocks = 0;
  private inertSiblings: HTMLElement[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.closeAll(false));
  }

  /** `true` enquanto há um modal (`<dialog>`/drawer) aberto: o resto da página, inclusive o toast, fica `inert`. */
  readonly modalOpen = signal(false);

  /** Quantidade de overlays abertos (sem contar os que estão saindo). */
  get openCount(): number {
    return this.stack.length;
  }

  open<C = unknown, D = unknown, R = unknown>(content: Type<C> | TemplateRef<ShyOverlayContext<D>>, config: ShyOverlayConfig<D> = {}): ShyOverlayRef<R, C> {
    if (!this.isBrowser) return this.detachedRef<R, C>();

    const layer: ShyOverlayLayer = config.layer ?? 'modal';
    const modal = config.modal ?? (layer === 'modal' || layer === 'drawer');
    const pane = this.doc.createElement(modal ? 'dialog' : 'div');
    const topLayer = modal ? typeof (pane as HTMLDialogElement).showModal === 'function' : typeof pane.showPopover === 'function';
    const popover = !modal;

    pane.className = ['shy-overlay-pane', config.paneClass].filter(Boolean).join(' ');
    pane.tabIndex = -1;
    pane.dataset['layer'] = layer;
    if (modal) pane.dataset['modal'] = '';
    if (popover) pane.setAttribute('popover', 'manual');
    if (config.anchor) pane.dataset['anchored'] = '';
    pane.style.zIndex = `var(--shy-z-${layer})`;
    this.applyAria(pane, config);

    const ref = new ShyOverlayRef<R, C>(pane, {
      close: (animate) => this.dispose(entry, animate),
      position: () => this.position(entry),
    });
    const entry: Entry = {
      ref,
      pane,
      config,
      rank: layerRank(layer),
      modal,
      popover,
      topLayer,
      previousFocus: this.doc.activeElement,
      backdrop: null,
      destroyContent: () => undefined,
      onKeydown: null,
    };

    const container = this.ensureContainer();
    if (modal && !topLayer) {
      entry.backdrop = this.doc.createElement('div');
      entry.backdrop.className = 'shy-overlay-backdrop';
      container.append(entry.backdrop);
      this.inertOthers(container);
    }
    // Um modal deixa `inert` tudo que está fora dele (inclusive o top layer): painéis ancorados em conteúdo do modal
    // (ex.: o painel de um Select dentro de um Dialog) precisam ser filhos dele para continuar interativos.
    const host = config.anchor ? [...this.stack].reverse().find((e) => e.modal && e.pane.contains(config.anchor!)) : undefined;
    (host?.pane ?? container).append(pane);
    this.live.add(entry);

    entry.destroyContent = this.render(content, pane, ref, config, (instance) => (ref.componentInstance = instance as C));
    this.show(entry);
    this.stack.push(entry);
    this.modalOpen.set(this.stack.some((e) => e.modal));
    this.promote(entry);
    this.listen();

    if (modal) {
      this.lockScroll();
      entry.onKeydown = (event) => {
        trapTab(pane, event as KeyboardEvent);
      };
      pane.addEventListener('keydown', entry.onKeydown);
    }
    pane.addEventListener('cancel', this.onCancel);
    pane.addEventListener('close', () => void ref.finish(undefined, false));

    this.position(entry);
    focusInitial(pane, config.initialFocus ?? (modal ? 'first' : 'none'));
    return ref;
  }

  /** Fecha todos, do topo para a base. Sem `animate`, remove na hora (usado ao destruir o serviço). */
  closeAll(animate = true): Promise<void> {
    return Promise.all([...this.stack].reverse().map((entry) => entry.ref.finish(undefined, animate))).then(() => undefined);
  }

  private detachedRef<R, C>(): ShyOverlayRef<R, C> {
    const ref = new ShyOverlayRef<R, C>(this.doc.createElement('div'), { close: () => Promise.resolve(), position: () => undefined });
    void ref.finish(undefined, false);
    return ref;
  }

  private applyAria(pane: HTMLElement, config: ShyOverlayConfig): void {
    if (config.role) pane.setAttribute('role', config.role);
    if (config.ariaLabel) pane.setAttribute('aria-label', config.ariaLabel);
    if (config.ariaLabelledBy) pane.setAttribute('aria-labelledby', config.ariaLabelledBy);
    if (config.ariaDescribedBy) pane.setAttribute('aria-describedby', config.ariaDescribedBy);
  }

  private ensureContainer(): HTMLElement {
    if (!this.container) {
      this.container = this.doc.createElement('div');
      this.container.className = 'shy-overlay-container';
      this.doc.body.append(this.container);
    }
    return this.container;
  }

  /** Cria o conteúdo dentro do painel e devolve a função que o destrói. */
  private render<C, D>(content: Type<C> | TemplateRef<ShyOverlayContext<D>>, pane: HTMLElement, ref: AnyOverlayRef, config: ShyOverlayConfig<D>, onInstance: (instance: C) => void): () => void {
    if (content instanceof TemplateRef) {
      const view: EmbeddedViewRef<ShyOverlayContext<D>> = content.createEmbeddedView({ $implicit: config.data, overlayRef: ref });
      this.appRef.attachView(view);
      pane.append(...view.rootNodes);
      view.detectChanges();
      return () => {
        this.appRef.detachView(view);
        view.destroy();
      };
    }

    const elementInjector = Injector.create({
      parent: config.injector ?? this.injector,
      providers: [
        { provide: ShyOverlayRef, useValue: ref },
        { provide: SHY_OVERLAY_DATA, useValue: config.data },
      ],
    });
    const component = createComponent(content, { environmentInjector: this.envInjector, elementInjector });
    this.appRef.attachView(component.hostView);
    pane.append(component.location.nativeElement);
    component.changeDetectorRef.detectChanges();
    onInstance(component.instance);
    return () => {
      this.appRef.detachView(component.hostView);
      component.destroy();
    };
  }

  private show(entry: Entry): void {
    const { pane, modal, topLayer } = entry;
    if (modal) {
      const dialog = pane as HTMLDialogElement;
      if (topLayer) dialog.showModal();
      else dialog.show();
    } else if (topLayer) {
      pane.showPopover();
    }
  }

  /**
   * Ordem de abertura no top layer: quem abre por último fica por cima. Popover/tooltip/toast de camada mais alta que o
   * overlay novo são reabertos (sem animação) para continuar acima dele; `<dialog>` não dá para reabrir sem fechar.
   */
  private promote(opened: Entry): void {
    for (const entry of this.stack) {
      if (entry === opened || !entry.popover || !entry.topLayer || entry.rank <= opened.rank) continue;
      const { pane } = entry;
      const focused = pane.contains(this.doc.activeElement) ? (this.doc.activeElement as HTMLElement) : null;
      pane.setAttribute('data-promoting', '');
      pane.hidePopover();
      pane.showPopover();
      pane.getBoundingClientRect(); // aplica o estilo sem animação antes de liberar
      pane.removeAttribute('data-promoting');
      focused?.focus();
    }
  }

  private async dispose(entry: Entry, animate: boolean): Promise<void> {
    // Painéis abertos dentro deste modal (ver `open`) não sobrevivem a ele.
    const children = this.stack.filter((e) => e !== entry && entry.pane.contains(e.pane));
    await Promise.all(children.map((child) => child.ref.finish(undefined, false)));

    const index = this.stack.indexOf(entry);
    if (index >= 0) this.stack.splice(index, 1);
    this.modalOpen.set(this.stack.some((e) => e.modal));
    if (!this.stack.length) this.unlisten();

    const { pane } = entry;
    pane.removeEventListener('cancel', this.onCancel);
    if (entry.onKeydown) pane.removeEventListener('keydown', entry.onKeydown);

    const hide = () => {
      if (entry.modal) {
        if ((pane as HTMLDialogElement).open) (pane as HTMLDialogElement).close();
      } else if (entry.topLayer) {
        try {
          pane.hidePopover();
        } catch {
          // já estava fechado (ex.: o navegador fechou por fora)
        }
      }
    };
    if (animate) await animateOut(pane, { onDone: hide });
    else hide();

    entry.destroyContent();
    pane.remove();
    entry.backdrop?.remove();
    this.live.delete(entry);

    if (entry.modal) {
      this.unlockScroll();
      if (!this.stack.some((e) => e.modal)) this.restoreInert();
    }
    if (!this.live.size) {
      this.container?.remove();
      this.container = null;
    }

    const active = this.doc.activeElement;
    if (entry.config.restoreFocus !== false && (!active || active === this.doc.body || pane.contains(active))) restoreFocus(entry.previousFocus);
  }

  /** Posiciona o painel junto à âncora. Medidas em px viram `ru` pela unidade responsiva medida (regra de unidades). */
  private position(entry: Entry): void {
    const { pane, config } = entry;
    const anchor = config.anchor;
    const view = this.doc.defaultView;
    if (!anchor || !view || !anchor.isConnected) return;

    const unit = this.unitPx();
    const options = config.position ?? {};
    const a = anchor.getBoundingClientRect();
    if (options.matchWidth) pane.style.inlineSize = ru(a.width / unit);
    const f = pane.getBoundingClientRect();

    const result = computePosition(a, f, this.viewport(view), {
      placement: options.placement,
      offset: (options.offset ?? DEFAULT_OFFSET) * unit,
      padding: (options.padding ?? DEFAULT_PADDING) * unit,
      flip: options.flip,
      shift: options.shift,
      matchWidth: options.matchWidth,
      rtl: this.doc.dir === 'rtl' || this.doc.documentElement.dir === 'rtl' || view.getComputedStyle(anchor).direction === 'rtl',
    });
    // Coordenadas físicas (left/top), porque vêm de getBoundingClientRect.
    pane.style.left = ru(result.x / unit);
    pane.style.top = ru(result.y / unit);
    pane.dataset['placement'] = result.placement;
  }

  private viewport(view: Window): ShyRect {
    const vv = view.visualViewport;
    if (vv) return { x: vv.offsetLeft, y: vv.offsetTop, width: vv.width, height: vv.height };
    const el = this.doc.documentElement;
    return { x: 0, y: 0, width: el.clientWidth, height: el.clientHeight };
  }

  /** Tamanho em px de 1 `--shy-responsive-unit` (1 se não der para medir, ex.: sem CSS ou fora do navegador). */
  private unitPx(): number {
    const probe = this.doc.createElement('div');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;block-size:0;inline-size:var(--shy-responsive-unit)';
    this.doc.body.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width > 0 ? width : 1;
  }

  // Esc, clique fora e reposicionamento

  private listen(): void {
    if (this.listening) return;
    this.listening = true;
    const view = this.doc.defaultView;
    this.doc.addEventListener('keydown', this.onKeydown);
    this.doc.addEventListener('pointerdown', this.onPointerDown, true);
    view?.addEventListener('resize', this.onViewport);
    view?.addEventListener('scroll', this.onViewport, true);
  }

  private unlisten(): void {
    if (!this.listening) return;
    this.listening = false;
    const view = this.doc.defaultView;
    this.doc.removeEventListener('keydown', this.onKeydown);
    this.doc.removeEventListener('pointerdown', this.onPointerDown, true);
    view?.removeEventListener('resize', this.onViewport);
    view?.removeEventListener('scroll', this.onViewport, true);
  }

  /** Camada do topo para Esc e clique fora; os `passive` (ex.: o outlet do Snackbar) não participam. */
  private topClosable(): Entry | undefined {
    for (let i = this.stack.length - 1; i >= 0; i--) if (!this.stack[i].config.passive) return this.stack[i];
    return undefined;
  }

  /** Fase de bolha: se o conteúdo já tratou o Esc (`preventDefault`), a camada não fecha. */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    const top = this.topClosable();
    if (!top || top.config.closeOnEscape === false) return;
    event.preventDefault();
    void top.ref.close();
  };

  /** O Esc nativo do `<dialog>` é do serviço: sem isto o navegador fecharia por fora da pilha. */
  private readonly onCancel = (event: Event): void => event.preventDefault();

  private readonly onPointerDown = (event: Event): void => {
    const top = this.topClosable();
    if (!top) return;
    const closes = top.config.closeOnOutsideClick ?? !top.modal;
    if (!closes) return;
    const target = event.target as Node | null;
    if (!target || top.config.anchor?.contains(target)) return;
    if (this.isOutside(top, target, event as MouseEvent)) void top.ref.close();
  };

  /** `<dialog>` modal: o backdrop entrega o clique ao próprio `<dialog>`, então "dentro" exige estar no retângulo dele. */
  private isOutside(entry: Entry, target: Node, event: MouseEvent): boolean {
    const { pane } = entry;
    if (entry.backdrop?.contains(target)) return true;
    if (!pane.contains(target)) return true;
    if (target !== pane) return false;
    const rect = pane.getBoundingClientRect();
    if (!rect.width && !rect.height) return false;
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  private readonly onViewport = (): void => {
    for (const entry of this.stack) if (entry.config.anchor) this.position(entry);
  };

  // Scroll lock e fallback de inert

  private lockScroll(): void {
    if (this.scrollLocks++ === 0) this.doc.documentElement.setAttribute('data-shy-scroll-lock', '');
  }

  private unlockScroll(): void {
    if (this.scrollLocks > 0 && --this.scrollLocks === 0) this.doc.documentElement.removeAttribute('data-shy-scroll-lock');
  }

  /** Só sem `showModal`: o `<dialog>` nativo já deixa o resto da página `inert`. */
  private inertOthers(container: HTMLElement): void {
    for (const el of Array.from(this.doc.body.children) as HTMLElement[]) {
      if (el === container || el.inert) continue;
      el.inert = true;
      this.inertSiblings.push(el);
    }
  }

  private restoreInert(): void {
    for (const el of this.inertSiblings) el.inert = false;
    this.inertSiblings = [];
  }
}
