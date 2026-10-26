import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawerComponent } from '../../components/drawer/drawer.component';
import { OverlayService } from '../../overlay/overlay.service';
import { DrawerService } from './drawer.service';

@Component({ imports: [DrawerComponent], template: `<shy-drawer heading="Filtros" closeLabel="Fechar"><input /></shy-drawer>` })
class Content {}

function pointer(type: string, x: number, y: number, time: number, target?: Element): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true }, pointerType: { value: 'touch' }, clientX: { value: x }, clientY: { value: y }, timeStamp: { value: time } });
  (target ?? document.body).dispatchEvent(event);
  return event;
}

describe('DrawerService: dragToClose e showHandle', () => {
  let drawers: DrawerService;

  beforeEach(() => (drawers = TestBed.inject(DrawerService)));

  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    document.documentElement.removeAttribute('data-shy-scroll-lock');
  });

  const drag = (pane: HTMLElement, from: [number, number], to: [number, number], ms: number) => {
    const header = pane.querySelector<HTMLElement>('.header')!;
    pointer('pointerdown', from[0], from[1], 0, header);
    pointer('pointermove', (from[0] + to[0]) / 2, (from[1] + to[1]) / 2, ms / 2, header);
    pointer('pointermove', to[0], to[1], ms, header);
    pointer('pointerup', to[0], to[1], ms, header);
  };

  it('sem dragToClose não há arrasto nem classe draggable', async () => {
    const ref = drawers.open(Content, { side: 'bottom' });
    expect(ref.pane.classList.contains('shy-drawer-pane--draggable')).toBe(false);
    expect(ref.pane.querySelector('.header')!.hasAttribute('data-shy-drag-handle')).toBe(true);
    drag(ref.pane, [100, 100], [100, 700], 200);
    expect(ref.isOpen()).toBe(true);
  });

  it('bottom: arrastar o cabeçalho para baixo além de 40% fecha; arrasto curto volta ao repouso', async () => {
    const ref = drawers.open(Content, { side: 'bottom', dragToClose: true });
    Object.defineProperty(ref.pane, 'offsetHeight', { value: 400 });
    expect(ref.pane.classList.contains('shy-drawer-pane--draggable')).toBe(true);

    drag(ref.pane, [100, 100], [100, 150], 800);
    expect(ref.isOpen()).toBe(true);
    expect(ref.pane.style.getPropertyValue('--_drag-y')).toBe('');

    drag(ref.pane, [100, 100], [100, 300], 600);
    await ref.closed;
    expect(ref.isOpen()).toBe(false);
  });

  it('arrastar para o lado errado (para cima, em bottom) não fecha', async () => {
    const ref = drawers.open(Content, { side: 'bottom', dragToClose: true });
    Object.defineProperty(ref.pane, 'offsetHeight', { value: 400 });
    drag(ref.pane, [100, 300], [100, 0], 200);
    expect(ref.isOpen()).toBe(true);
  });

  it('end fecha arrastando para a direita; start, para a esquerda', async () => {
    const end = drawers.open(Content, { side: 'end', dragToClose: true, closeOnOutsideClick: false });
    Object.defineProperty(end.pane, 'offsetWidth', { value: 300 });
    drag(end.pane, [100, 100], [10, 100], 200);
    expect(end.isOpen()).toBe(true);
    drag(end.pane, [100, 100], [260, 100], 200);
    await end.closed;
    expect(end.isOpen()).toBe(false);

    const start = drawers.open(Content, { side: 'start', dragToClose: true, closeOnOutsideClick: false });
    Object.defineProperty(start.pane, 'offsetWidth', { value: 300 });
    drag(start.pane, [260, 100], [100, 100], 200);
    await start.closed;
    expect(start.isOpen()).toBe(false);
  });

  it('o corpo não inicia o arrasto (ele rola)', async () => {
    const ref = drawers.open(Content, { side: 'bottom', dragToClose: true });
    Object.defineProperty(ref.pane, 'offsetHeight', { value: 400 });
    const body = ref.pane.querySelector<HTMLElement>('.body')!;
    pointer('pointerdown', 100, 100, 0, body);
    pointer('pointermove', 100, 300, 100, body);
    pointer('pointerup', 100, 300, 120, body);
    expect(ref.isOpen()).toBe(true);
  });

  it('showHandle mostra um botão com o nome de closeLabel que fecha o painel', async () => {
    const ref = drawers.open(Content, { side: 'bottom', showHandle: true });
    await new Promise((r) => setTimeout(r));
    TestBed.tick();
    const handle = ref.pane.querySelector<HTMLButtonElement>('.handle')!;
    expect(handle).not.toBeNull();
    expect(handle.getAttribute('aria-label')).toBe('Fechar');
    handle.click();
    await ref.closed;
    expect(ref.isOpen()).toBe(false);

    const without = drawers.open(Content, { side: 'bottom' });
    await new Promise((r) => setTimeout(r));
    TestBed.tick();
    expect(without.pane.querySelector('.handle')).toBeNull();
  });
});
