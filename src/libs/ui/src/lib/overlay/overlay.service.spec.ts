import { Component, inject, PLATFORM_ID, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyOverlayContext } from '../interfaces/overlay/overlay.interface';
import { SHY_OVERLAY_DATA, ShyOverlayRef } from './overlay-ref';
import { OverlayService } from './overlay.service';

@Component({
  selector: 'test-content',
  template: `
    <button id="first" type="button">first</button>
    <button id="second" type="button">second</button>
  `,
})
class Content {
  readonly ref = inject(ShyOverlayRef);
  readonly data = inject(SHY_OVERLAY_DATA);
}

@Component({
  template: `
    <ng-template #tpl let-data let-ref="overlayRef">
      <span id="tpl">{{ data }}</span>
      <button id="tpl-close" type="button" (click)="ref.close('done')">x</button>
    </ng-template>
  `,
})
class TemplateHost {
  readonly tpl = viewChild.required<TemplateRef<ShyOverlayContext<string>>>('tpl');
}

const container = () => document.querySelector('.shy-overlay-container');
const panes = () => Array.from(document.querySelectorAll<HTMLElement>('.shy-overlay-pane'));
const key = (k: string, target: EventTarget = document.body) => {
  const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};
const pointerdown = (target: EventTarget) => target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));

describe('OverlayService', () => {
  let overlay: OverlayService;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    overlay = TestBed.inject(OverlayService);
    trigger = document.createElement('button');
    trigger.id = 'trigger';
    document.body.append(trigger);
    trigger.focus();
  });

  afterEach(async () => {
    await overlay.closeAll(false);
    trigger.remove();
    document.documentElement.removeAttribute('data-shy-scroll-lock');
    vi.restoreAllMocks();
  });

  describe('abrir e fechar', () => {
    it('modal: <dialog> aberto no container, com o componente, o ref e os dados injetados', () => {
      const ref = overlay.open(Content, { data: { id: 7 }, ariaLabel: 'Detalhes' });
      const pane = panes()[0] as HTMLDialogElement;

      expect(container()).not.toBeNull();
      expect(pane.tagName).toBe('DIALOG');
      expect(pane.open).toBe(true);
      expect(pane.dataset['layer']).toBe('modal');
      expect(pane.getAttribute('aria-label')).toBe('Detalhes');
      expect(pane.querySelector('#first')).not.toBeNull();
      expect((ref.componentInstance as Content).data).toEqual({ id: 7 });
      expect((ref.componentInstance as Content).ref).toBe(ref);
      expect(ref.isOpen()).toBe(true);
    });

    it('fora de modal usa [popover="manual"] e abre no top layer', () => {
      overlay.open(Content, { layer: 'popover' });
      const pane = panes()[0];
      expect(pane.tagName).toBe('DIV');
      expect(pane.getAttribute('popover')).toBe('manual');
      expect(pane.hasAttribute('data-popover-open')).toBe(true);
    });

    it('close(result) resolve closed, remove o painel e o container sob demanda', async () => {
      const ref = overlay.open<Content, unknown, string>(Content);
      await ref.close('ok');
      expect(await ref.closed).toBe('ok');
      expect(ref.isOpen()).toBe(false);
      expect(panes()).toHaveLength(0);
      expect(container()).toBeNull();
      expect(overlay.openCount).toBe(0);
    });

    it('o container só some quando o último fecha', async () => {
      const a = overlay.open(Content, { layer: 'popover' });
      const b = overlay.open(Content, { layer: 'popover' });
      await a.close();
      expect(container()).not.toBeNull();
      await b.close();
      expect(container()).toBeNull();
    });

    it('close repetido reaproveita a mesma saída; sem resultado resolve undefined', async () => {
      const ref = overlay.open(Content);
      await Promise.all([ref.close('a'), ref.close('b')]);
      expect(await ref.closed).toBe('a');
      const other = overlay.open(Content);
      await other.close();
      expect(await other.closed).toBeUndefined();
    });

    it('template: contexto com $implicit e overlayRef; o conteúdo pode fechar com resultado', async () => {
      const fixture = TestBed.createComponent(TemplateHost);
      fixture.detectChanges();
      const ref = overlay.open<unknown, string, string>(fixture.componentInstance.tpl(), { data: 'olá' });

      expect(panes()[0].querySelector('#tpl')?.textContent).toBe('olá');
      (panes()[0].querySelector('#tpl-close') as HTMLButtonElement).click();
      expect(await ref.closed).toBe('done');
      expect(panes()).toHaveLength(0);
    });

    it('classe, role e aria extras vão para o painel', () => {
      overlay.open(Content, { paneClass: 'a b', role: 'alertdialog', ariaLabelledBy: 't', ariaDescribedBy: 'd' });
      const pane = panes()[0];
      expect(pane.classList.contains('a') && pane.classList.contains('b')).toBe(true);
      expect(pane.getAttribute('role')).toBe('alertdialog');
      expect(pane.getAttribute('aria-labelledby')).toBe('t');
      expect(pane.getAttribute('aria-describedby')).toBe('d');
    });

    it('fechar o <dialog> por fora (evento close) também encerra o overlay', async () => {
      const ref = overlay.open(Content);
      panes()[0].dispatchEvent(new Event('close'));
      expect(await ref.closed).toBeUndefined();
      expect(overlay.openCount).toBe(0);
    });

    it('closeAll fecha do topo para a base', async () => {
      const order: string[] = [];
      const a = overlay.open(Content, { layer: 'popover' });
      const b = overlay.open(Content, { layer: 'popover' });
      void a.closed.then(() => order.push('a'));
      void b.closed.then(() => order.push('b'));
      await overlay.closeAll();
      expect(order).toEqual(['b', 'a']);
    });

    it('no servidor devolve um ref já fechado e não toca o DOM', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      const ref = TestBed.inject(OverlayService).open(Content);
      expect(await ref.closed).toBeUndefined();
      expect(ref.isOpen()).toBe(false);
      expect(container()).toBeNull();
    });
  });

  describe('pilha, promoção e Esc', () => {
    it('Esc fecha só a camada do topo', async () => {
      const bottom = overlay.open(Content, { layer: 'popover' });
      const top = overlay.open(Content, { layer: 'popover' });
      const event = key('Escape');

      await top.closed;
      expect(event.defaultPrevented).toBe(true);
      expect(top.isOpen()).toBe(false);
      expect(bottom.isOpen()).toBe(true);
      key('Escape');
      await bottom.closed;
      expect(overlay.openCount).toBe(0);
    });

    it('closeOnEscape: false não fecha (e não passa para a camada de baixo)', () => {
      const bottom = overlay.open(Content, { layer: 'popover' });
      const top = overlay.open(Content, { layer: 'popover', closeOnEscape: false });
      key('Escape');
      expect(top.isOpen()).toBe(true);
      expect(bottom.isOpen()).toBe(true);
    });

    it('Esc já tratado pelo conteúdo (preventDefault) não fecha', () => {
      const ref = overlay.open(Content, { layer: 'popover' });
      ref.pane.addEventListener('keydown', (event) => event.preventDefault());
      key('Escape', ref.pane.querySelector('#first')!);
      expect(ref.isOpen()).toBe(true);
    });

    it('o cancel nativo do <dialog> é bloqueado (o serviço decide)', () => {
      overlay.open(Content, { closeOnEscape: false });
      const cancel = new Event('cancel', { cancelable: true });
      panes()[0].dispatchEvent(cancel);
      expect(cancel.defaultPrevented).toBe(true);
    });

    it('abrir um modal promove tooltip e toast (rank maior) e deixa o popover de rank menor quieto', () => {
      const hide = vi.spyOn(HTMLElement.prototype, 'hidePopover');
      const show = vi.spyOn(HTMLElement.prototype, 'showPopover');
      overlay.open(Content, { layer: 'dropdown' });
      overlay.open(Content, { layer: 'tooltip' });
      overlay.open(Content, { layer: 'toast' });
      hide.mockClear();
      show.mockClear();

      overlay.open(Content, { layer: 'modal' });

      const promoted = hide.mock.contexts.map((el) => (el as HTMLElement).dataset['layer']).sort();
      expect(promoted).toEqual(['toast', 'tooltip']);
      expect(show).toHaveBeenCalledTimes(2);
      expect(document.querySelectorAll('[data-promoting]')).toHaveLength(0);
    });

    it('overlay de rank alto não promove os de rank menor', () => {
      const hide = vi.spyOn(HTMLElement.prototype, 'hidePopover');
      overlay.open(Content, { layer: 'popover' });
      overlay.open(Content, { layer: 'tooltip' });
      expect(hide).not.toHaveBeenCalled();
    });

    it('a promoção devolve o foco que estava dentro do painel promovido', () => {
      const toast = overlay.open(Content, { layer: 'toast', initialFocus: 'first' });
      expect(document.activeElement?.id).toBe('first');
      overlay.open(Content, { layer: 'modal', initialFocus: 'none' });
      expect(toast.pane.contains(document.activeElement)).toBe(true);
    });

    it('cada camada fica no z-index do token e pode ser lida em runtime', () => {
      overlay.open(Content, { layer: 'tooltip' });
      expect(panes()[0].style.zIndex).toBe('var(--shy-z-tooltip)');
    });
  });

  describe('clique fora', () => {
    it('fecha popover por padrão ao clicar fora, mas não ao clicar dentro', async () => {
      const ref = overlay.open(Content, { layer: 'popover' });
      pointerdown(ref.pane.querySelector('#first')!);
      expect(ref.isOpen()).toBe(true);

      pointerdown(document.body);
      await ref.closed;
      expect(ref.isOpen()).toBe(false);
    });

    it('clicar na âncora não fecha (quem abre decide o toggle)', () => {
      const ref = overlay.open(Content, { layer: 'popover', anchor: trigger });
      pointerdown(trigger);
      expect(ref.isOpen()).toBe(true);
    });

    it('modal não fecha por padrão; com closeOnOutsideClick fecha ao clicar no backdrop', async () => {
      const modal = overlay.open(Content);
      pointerdown(document.body);
      expect(modal.isOpen()).toBe(true);
      await modal.close();

      const closable = overlay.open(Content, { closeOnOutsideClick: true });
      vi.spyOn(closable.pane, 'getBoundingClientRect').mockReturnValue({ left: 100, right: 200, top: 100, bottom: 200, width: 100, height: 100 } as DOMRect);
      // clique no próprio <dialog> dentro do retângulo: dentro
      closable.pane.dispatchEvent(Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 150, clientY: 150 })));
      expect(closable.isOpen()).toBe(true);
      // clique no backdrop (alvo = <dialog>, fora do retângulo): fora
      closable.pane.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 }));
      await closable.closed;
      expect(closable.isOpen()).toBe(false);
    });

    it('closeOnOutsideClick: false mantém o popover', () => {
      const ref = overlay.open(Content, { layer: 'popover', closeOnOutsideClick: false });
      pointerdown(document.body);
      expect(ref.isOpen()).toBe(true);
    });

    it('só a camada do topo reage ao clique fora', async () => {
      const bottom = overlay.open(Content, { layer: 'popover' });
      const top = overlay.open(Content, { layer: 'popover' });
      pointerdown(document.body);
      await top.closed;
      expect(bottom.isOpen()).toBe(true);
    });
  });

  describe('foco', () => {
    it('modal foca o primeiro elemento e devolve o foco ao fechar', async () => {
      const ref = overlay.open(Content);
      expect(document.activeElement?.id).toBe('first');
      await ref.close();
      expect(document.activeElement).toBe(trigger);
    });

    it('fora de modal não rouba o foco por padrão, mas initialFocus pode pedir', () => {
      overlay.open(Content, { layer: 'popover' });
      expect(document.activeElement).toBe(trigger);
      overlay.open(Content, { layer: 'popover', initialFocus: 'pane' });
      expect(document.activeElement).toBe(panes()[1]);
    });

    it('restoreFocus: false não devolve o foco', async () => {
      const ref = overlay.open(Content, { restoreFocus: false });
      await ref.close();
      expect(document.activeElement).not.toBe(trigger);
    });

    it('não rouba o foco de quem o moveu para outro lugar fora do painel', async () => {
      const ref = overlay.open(Content, { layer: 'popover' });
      const other = document.createElement('input');
      document.body.append(other);
      other.focus();
      await ref.close();
      expect(document.activeElement).toBe(other);
      other.remove();
    });

    it('modal prende o Tab entre o primeiro e o último', () => {
      overlay.open(Content);
      const pane = panes()[0];
      const second = pane.querySelector<HTMLElement>('#second')!;
      second.focus();
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      second.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement?.id).toBe('first');
    });
  });

  describe('painel ancorado dentro de um modal', () => {
    it('vira filho do modal (continua interativo) e fecha junto com ele', async () => {
      const modal = overlay.open(Content);
      const inside = modal.pane.querySelector<HTMLElement>('#first')!;
      const popover = overlay.open(Content, { layer: 'popover', anchor: inside });

      expect(modal.pane.contains(popover.pane)).toBe(true);
      const outside = overlay.open(Content, { layer: 'popover', anchor: trigger });
      expect(modal.pane.contains(outside.pane)).toBe(false);

      await modal.close();
      expect(popover.isOpen()).toBe(false);
      expect(outside.isOpen()).toBe(true);
    });
  });

  describe('scroll lock', () => {
    const locked = () => document.documentElement.hasAttribute('data-shy-scroll-lock');

    it('modal trava e libera só quando o último modal fecha; popover não trava', async () => {
      const popover = overlay.open(Content, { layer: 'popover' });
      expect(locked()).toBe(false);

      const a = overlay.open(Content);
      const b = overlay.open(Content, { layer: 'drawer' });
      expect(locked()).toBe(true);
      await a.close();
      expect(locked()).toBe(true);
      await b.close();
      expect(locked()).toBe(false);
      await popover.close();
    });
  });

  describe('posição', () => {
    beforeEach(() => {
      // happy-dom não faz layout: dá uma viewport ao cálculo.
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
      vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    });

    it('com âncora calcula left/top em ru e registra o placement', () => {
      vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({ x: 20, y: 30, left: 20, top: 30, right: 100, bottom: 60, width: 80, height: 30 } as DOMRect);
      const ref = overlay.open(Content, { layer: 'popover', anchor: trigger, position: { placement: 'bottom-start', offset: 0 } });
      expect(ref.pane.dataset['anchored']).toBeDefined();
      expect(ref.pane.dataset['placement']).toBeDefined();
      expect(ref.pane.style.left).toContain('--shy-responsive-unit');
      expect(ref.pane.style.top).toContain('--shy-responsive-unit');
    });

    it('matchWidth iguala a largura da âncora; updatePosition recalcula', () => {
      const rect = vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 120, bottom: 20, width: 120, height: 20 } as DOMRect);
      const ref = overlay.open(Content, { layer: 'popover', anchor: trigger, position: { matchWidth: true } });
      expect(ref.pane.style.inlineSize).toBe('calc(var(--shy-responsive-unit) * 120)');

      rect.mockReturnValue({ x: 40, y: 0, left: 40, top: 0, right: 160, bottom: 20, width: 120, height: 20 } as DOMRect);
      const before = ref.pane.style.left;
      ref.updatePosition();
      expect(ref.pane.style.left).not.toBe(before);
    });

    it('resize e scroll reposicionam os overlays ancorados', () => {
      const rect = vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 50, bottom: 20, width: 50, height: 20 } as DOMRect);
      const ref = overlay.open(Content, { layer: 'popover', anchor: trigger });
      const before = ref.pane.style.top;
      rect.mockReturnValue({ x: 0, y: 70, left: 0, top: 70, right: 50, bottom: 90, width: 50, height: 20 } as DOMRect);
      window.dispatchEvent(new Event('resize'));
      expect(ref.pane.style.top).not.toBe(before);
    });
  });

  describe('fallback sem top layer', () => {
    it('modal sem showModal usa backdrop do container e deixa o resto da página inert', async () => {
      const original = HTMLDialogElement.prototype.showModal;
      // @ts-expect-error simula navegador sem showModal
      HTMLDialogElement.prototype.showModal = undefined;
      const app = document.createElement('main');
      document.body.append(app);
      try {
        const ref = overlay.open(Content);
        expect(container()?.querySelector('.shy-overlay-backdrop')).not.toBeNull();
        expect(app.inert).toBe(true);
        await ref.close();
        expect(app.inert).toBe(false);
        expect(container()).toBeNull();
      } finally {
        HTMLDialogElement.prototype.showModal = original;
        app.remove();
      }
    });
  });
});
