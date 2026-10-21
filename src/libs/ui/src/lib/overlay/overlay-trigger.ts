import { DestroyRef, Directive, ElementRef, inject, signal, TemplateRef, Type } from '@angular/core';
import { ShyOverlayConfig, ShyOverlayContext } from '../interfaces/overlay/overlay.interface';
import { focusableElements } from './focus-scope';
import { ShyOverlayRef } from './overlay-ref';
import { OverlayService } from './overlay.service';

let nextId = 0;

/**
 * Base interna de Popover e Menu: o elemento com a diretiva abre um painel ancorado nele (`OverlayService`).
 * Cuida de abrir/fechar/alternar, de `aria-expanded`/`aria-controls` e de devolver o foco ao gatilho
 * quando o Tab sai do painel (o painel mora no fim do `body`, fora da ordem de tabulação do gatilho). Não é exportada.
 */
@Directive({
  host: {
    '[attr.aria-expanded]': 'expanded()',
    '[attr.aria-controls]': 'paneId()',
    '(click)': 'toggle()',
  },
})
export abstract class OverlayTrigger {
  protected readonly overlay = inject(OverlayService);
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly uid = `shy-overlay-${nextId++}`;
  private ref: ShyOverlayRef | null = null;

  /** `true` enquanto o painel está aberto. */
  readonly expanded = signal(false);
  protected readonly paneId = signal<string | null>(null);

  constructor() {
    inject(DestroyRef).onDestroy(() => void this.ref?.finish(undefined, false));
  }

  protected abstract content(): Type<unknown> | TemplateRef<ShyOverlayContext>;
  protected abstract overlayConfig(): ShyOverlayConfig;
  /** `edge`: o Tab fecha ao sair do primeiro/último focável. `always`: qualquer Tab fecha (menu). */
  protected tabCloses: 'edge' | 'always' = 'edge';

  /** Chamado com o painel já renderizado, antes do foco inicial. */
  protected opened(_ref: ShyOverlayRef): void {}

  /** Id do gatilho (criado se faltar), para rotular o painel por `aria-labelledby`. */
  protected hostId(): string {
    if (!this.host.id) this.host.id = `${this.uid}-trigger`;
    return this.host.id;
  }

  open(): ShyOverlayRef | null {
    if (this.ref) return this.ref;
    const ref = this.overlay.open(this.content(), { ...this.overlayConfig(), anchor: this.host });
    this.ref = ref;
    ref.pane.id = `${this.uid}-panel`;
    this.paneId.set(ref.pane.id);
    this.expanded.set(true);
    ref.pane.addEventListener('keydown', this.onPaneKeydown);
    void ref.closed.then(() => {
      if (this.ref !== ref) return;
      this.ref = null;
      this.paneId.set(null);
      this.expanded.set(false);
    });
    this.opened(ref);
    return ref;
  }

  close(): void {
    void this.ref?.close();
  }

  toggle(): void {
    if (this.ref) this.close();
    else this.open();
  }

  private readonly onPaneKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey || !this.ref) return;
    const items = focusableElements(this.ref.pane);
    const active = this.host.ownerDocument.activeElement;
    const atEdge = event.shiftKey ? active === items[0] || !items.length : active === items[items.length - 1] || !items.length;
    if (this.tabCloses === 'always' || atEdge) {
      // O padrão do navegador roda depois e segue do gatilho para o próximo/anterior da página.
      this.host.focus();
      this.close();
    }
  };
}
