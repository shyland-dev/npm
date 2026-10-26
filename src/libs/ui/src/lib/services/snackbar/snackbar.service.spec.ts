import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayService } from '../../overlay/overlay.service';
import { provideShySnackbar } from './snackbar.config';
import { SnackbarService } from './snackbar.service';

@Component({ template: 'conteúdo' })
class Dummy {}

const pane = () => document.querySelector('.shy-snackbar-pane') as HTMLElement | null;
const toasts = () => Array.from(document.querySelectorAll<HTMLElement>('.shy-snackbar-pane .toast'));
const texts = () => toasts().map((t) => t.querySelector('.toast__text')!.textContent!.trim());
const flush = async () => {
  await vi.advanceTimersByTimeAsync(0);
  TestBed.tick();
};

function pointer(type: string, init: { x: number; y?: number; time: number; pointerType?: string }): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    isPrimary: { value: true },
    pointerType: { value: init.pointerType ?? 'touch' },
    clientX: { value: init.x },
    clientY: { value: init.y ?? 0 },
    timeStamp: { value: init.time },
  });
  return event;
}

/** Toque que arrasta na horizontal de `from` até `to` em `ms`. */
function swipe(el: HTMLElement, from: number, to: number, ms = 400, pointerType = 'touch'): void {
  Object.defineProperty(el, 'offsetWidth', { value: 300, configurable: true });
  el.dispatchEvent(pointer('pointerdown', { x: from, time: 0, pointerType }));
  const steps = 5;
  for (let i = 1; i <= steps; i++) el.dispatchEvent(pointer('pointermove', { x: from + ((to - from) * i) / steps, time: (ms * i) / steps, pointerType }));
  el.dispatchEvent(pointer('pointerup', { x: to, time: ms, pointerType }));
}

describe('SnackbarService', () => {
  let snackbar: SnackbarService;

  beforeEach(() => {
    vi.useFakeTimers();
    snackbar = TestBed.inject(SnackbarService);
  });

  afterEach(async () => {
    snackbar.dismissAll();
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    vi.useRealTimers();
  });

  it('cria o contêiner na camada toast, com regiões vivas: status (educada) e alert (urgente)', async () => {
    snackbar.show('Salvo');
    await flush();

    expect(pane()!.dataset['layer']).toBe('toast');
    expect(pane()!.querySelectorAll('[role="status"]').length).toBe(2);
    expect(pane()!.querySelectorAll('[role="alert"]').length).toBe(2);
    expect(texts()).toEqual(['Salvo']);
    expect(toasts()[0].closest('[role="status"]')).not.toBeNull();
  });

  it('danger vai para a região role=alert; os outros intents, para status, com ícone (nunca só cor)', async () => {
    snackbar.show('Falhou', { intent: 'danger' });
    snackbar.show('Pronto', { intent: 'success' });
    await flush();

    const danger = toasts().find((t) => t.dataset['intent'] === 'danger')!;
    const success = toasts().find((t) => t.dataset['intent'] === 'success')!;
    expect(danger.closest('[role="alert"]')).not.toBeNull();
    expect(success.closest('[role="status"]')).not.toBeNull();
    expect(danger.querySelector('.toast__icon')).not.toBeNull();
    expect(success.querySelector('.toast__icon')).not.toBeNull();
  });

  it('fecha sozinho após a duração e resolve closed com "timeout"', async () => {
    const ref = snackbar.show('Oi', { duration: 1000 });
    await flush();
    expect(texts()).toEqual(['Oi']);

    await vi.advanceTimersByTimeAsync(1000);
    TestBed.tick();
    await vi.runAllTimersAsync();
    TestBed.tick();
    expect(await ref.closed).toBe('timeout');
    expect(toasts()).toEqual([]);
  });

  it('duration 0 não fecha sozinho; o botão de fechar resolve com "dismiss"', async () => {
    const ref = snackbar.show('Fica', { duration: 0 });
    await flush();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(texts()).toEqual(['Fica']);

    const close = toasts()[0].querySelector<HTMLButtonElement>('.toast__dismiss')!;
    expect(close.getAttribute('aria-label')).toBe('Dismiss');
    close.click();
    expect(await ref.closed).toBe('dismiss');
  });

  it('ação: o clique resolve com "action" e fecha; a duração padrão com ação é maior', async () => {
    const ref = snackbar.show('Item removido', { action: { label: 'Desfazer' } });
    await flush();
    const action = toasts()[0].querySelector<HTMLButtonElement>('.toast__action')!;
    expect(action.textContent).toContain('Desfazer');

    await vi.advanceTimersByTimeAsync(5000);
    expect(texts()).toEqual(['Item removido']); // 5000 é o padrão sem ação; com ação são 8000
    action.click();
    expect(await ref.closed).toBe('action');
  });

  it('fila: só maxVisible aparecem; ao fechar um, o próximo da fila entra', async () => {
    const refs = ['1', '2', '3', '4', '5'].map((n) => snackbar.show(`Toast ${n}`, { duration: 0 }));
    await flush();
    expect(texts()).toEqual(['Toast 1', 'Toast 2', 'Toast 3']);

    refs[0].dismiss();
    await vi.runAllTimersAsync();
    TestBed.tick();
    expect(texts()).toEqual(['Toast 2', 'Toast 3', 'Toast 4']);

    refs[4].dismiss(); // ainda na fila: sai sem nunca aparecer
    expect(await refs[4].closed).toBe('dismiss');
    refs[1].dismiss();
    await vi.runAllTimersAsync();
    TestBed.tick();
    expect(texts()).toEqual(['Toast 3', 'Toast 4']);
  });

  it('pausa o tempo com o ponteiro e o foco e retoma o que sobrou (WCAG 2.2.1)', async () => {
    const ref = snackbar.show('Pausa', { duration: 1000 });
    await flush();
    const toast = toasts()[0];

    await vi.advanceTimersByTimeAsync(600);
    toast.dispatchEvent(new Event('pointerenter'));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(texts()).toEqual(['Pausa']);

    toast.dispatchEvent(new Event('focusin', { bubbles: true }));
    toast.dispatchEvent(new Event('pointerleave'));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(texts()).toEqual(['Pausa']); // o foco ainda segura

    toast.dispatchEvent(new Event('focusout', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(399);
    expect(texts()).toEqual(['Pausa']);
    await vi.advanceTimersByTimeAsync(1);
    expect(await ref.closed).toBe('timeout'); // sobravam 400 ms dos 1000
  });

  it('com um modal aberto a ação some (o toast fica inert) e volta quando o modal fecha', async () => {
    snackbar.show('Com ação', { action: { label: 'Desfazer' }, duration: 0 });
    await flush();
    expect(toasts()[0].querySelector('.toast__action')).not.toBeNull();

    const overlay = TestBed.inject(OverlayService);
    const modal = overlay.open(Dummy, { layer: 'modal' });
    await flush();
    expect(overlay.modalOpen()).toBe(true);
    expect(toasts()[0].querySelector('.toast__action')).toBeNull();
    expect(texts()).toEqual(['Com ação']);

    await modal.close();
    await flush();
    expect(toasts()[0].querySelector('.toast__action')).not.toBeNull();
  });

  it('o outlet não captura o Esc: o overlay de baixo continua fechando', async () => {
    const overlay = TestBed.inject(OverlayService);
    const below = overlay.open(Dummy, { layer: 'popover', modal: false });
    snackbar.show('Aviso', { duration: 0 });
    await flush();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await vi.runAllTimersAsync();
    expect(below.isOpen()).toBe(false);
    expect(texts()).toEqual(['Aviso']);
  });

  it('position e align saem como atributos; provideShySnackbar muda os padrões', async () => {
    snackbar.show('Topo', { position: 'top', align: 'end', duration: 0 });
    await flush();
    expect(toasts()[0].dataset['position']).toBe('top');
    expect(toasts()[0].dataset['align']).toBe('end');
    expect(toasts()[0].closest('.region')!.getAttribute('data-position')).toBe('top');
  });
});

describe('SnackbarService: swipe', () => {
  let snackbar: SnackbarService;

  beforeEach(() => {
    vi.useFakeTimers();
    snackbar = TestBed.inject(SnackbarService);
  });

  afterEach(async () => {
    snackbar.dismissAll();
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    vi.useRealTimers();
  });

  it('arrastar além de 40% da largura fecha com "dismiss" (qualquer sentido) e pausa o tempo no arrasto', async () => {
    const ref = snackbar.show('Arraste', { duration: 1000 });
    await flush();
    const toast = toasts()[0];
    expect(toast.hasAttribute('data-swipe')).toBe(true);

    Object.defineProperty(toast, 'offsetWidth', { value: 300, configurable: true });
    toast.dispatchEvent(pointer('pointerdown', { x: 200, time: 0 }));
    toast.dispatchEvent(pointer('pointermove', { x: 150, time: 100 }));
    expect(toast.hasAttribute('data-swiping')).toBe(true);
    await vi.advanceTimersByTimeAsync(5000);
    expect(texts()).toEqual(['Arraste']); // o arrasto segura o timer
    toast.dispatchEvent(pointer('pointermove', { x: 20, time: 600 }));
    toast.dispatchEvent(pointer('pointerup', { x: 20, time: 700 }));

    expect(await ref.closed).toBe('dismiss');
    expect(toast.hasAttribute('data-swiped')).toBe(true);
  });

  it('um flick rápido fecha mesmo com pouca distância; arrasto curto e lento volta ao repouso', async () => {
    const quick = snackbar.show('Rápido', { duration: 0 });
    await flush();
    swipe(toasts()[0], 100, 160, 60);
    expect(await quick.closed).toBe('dismiss');
    await vi.runAllTimersAsync();
    TestBed.tick();

    const slow = snackbar.show('Lento', { duration: 0 });
    await flush();
    const toast = toasts()[0];
    swipe(toast, 100, 160, 1200);
    TestBed.tick();
    expect(texts()).toEqual(['Lento']);
    expect(toast.hasAttribute('data-swiped')).toBe(false);
    expect(toast.style.getPropertyValue('--_swipe-x')).toBe('');
    slow.dismiss();
  });

  it('mouse não arrasta; swipeToDismiss: false desliga o gesto', async () => {
    snackbar.show('Mouse', { duration: 0 });
    snackbar.show('Sem swipe', { duration: 0, swipeToDismiss: false });
    await flush();
    const [mouse, off] = toasts();

    swipe(mouse, 200, 0, 100, 'mouse');
    swipe(off, 200, 0, 100);
    TestBed.tick();
    expect(texts()).toEqual(['Mouse', 'Sem swipe']);
    expect(off.hasAttribute('data-swipe')).toBe(false);
  });
});

describe('SnackbarService: update, id, promise e undo', () => {
  let snackbar: SnackbarService;

  beforeEach(() => {
    vi.useFakeTimers();
    snackbar = TestBed.inject(SnackbarService);
  });

  afterEach(async () => {
    snackbar.dismissAll();
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    vi.useRealTimers();
  });

  it('update troca mensagem, intenção e ação e reinicia o tempo; danger muda para a região alert', async () => {
    const ref = snackbar.show('Antes', { duration: 1000 });
    await flush();
    await vi.advanceTimersByTimeAsync(900);

    ref.update({ message: 'Depois', intent: 'danger', action: { label: 'Tentar' } });
    await flush();
    expect(texts()).toEqual(['Depois']);
    expect(toasts()[0].closest('[role="alert"]')).not.toBeNull();
    expect(toasts()[0].querySelector('.toast__action')!.textContent).toContain('Tentar');

    await vi.advanceTimersByTimeAsync(7000); // o padrão com ação (8000) recomeçou
    expect(texts()).toEqual(['Depois']);
    await vi.advanceTimersByTimeAsync(1000);
    expect(await ref.closed).toBe('timeout');

    ref.update({ message: 'Fechado' }); // depois de fechado não faz nada
  });

  it('o mesmo id atualiza o toast aberto em vez de empilhar outro', async () => {
    const a = snackbar.show('Salvando 1', { id: 'save', duration: 0 });
    const b = snackbar.show('Salvando 2', { id: 'save', duration: 0 });
    await flush();
    expect(texts()).toEqual(['Salvando 2']);

    b.dismiss();
    expect(await a.closed).toBe('dismiss');
    snackbar.show('Novo', { id: 'save', duration: 0 });
    await flush();
    expect(texts()).toEqual(['Novo']); // depois de fechado o id é livre de novo
  });

  it('update num toast da fila só começa o tempo quando ele aparece', async () => {
    for (const n of ['1', '2', '3']) snackbar.show(`T${n}`, { duration: 0 });
    const queued = snackbar.show('Fila', { duration: 100 });
    await flush();
    queued.update({ message: 'Fila 2' });
    await vi.advanceTimersByTimeAsync(60_000);
    queued.dismiss();
    expect(await queued.closed).toBe('dismiss');
  });

  it('promise: loading (spinner, sem fechar) vira success; erro vira danger e é relançado', async () => {
    let resolve!: (v: number) => void;
    const done = snackbar.promise(new Promise<number>((r) => (resolve = r)), { loading: 'Salvando', success: (n) => `Salvo ${n}`, error: 'Falhou' });
    await flush();
    expect(texts()).toEqual(['Salvando']);
    expect(toasts()[0].querySelector('shy-spinner')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(texts()).toEqual(['Salvando']);

    resolve(7);
    expect(await done).toBe(7);
    await flush();
    expect(texts()).toEqual(['Salvo 7']);
    expect(toasts()[0].dataset['intent']).toBe('success');
    expect(toasts()[0].querySelector('shy-spinner')).toBeNull();

    snackbar.dismissAll();
    await vi.runAllTimersAsync();
    const failing = snackbar.promise(Promise.reject(new Error('x')), { loading: 'Enviando', success: 'ok', error: (e) => `Erro: ${(e as Error).message}` });
    await expect(failing).rejects.toThrow('x');
    await flush();
    expect(texts()).toEqual(['Erro: x']);
    expect(toasts()[0].closest('[role="alert"]')).not.toBeNull();
  });

  it('undo resolve "undo" no clique da ação e "commit" por tempo, X ou dismissAll', async () => {
    const first = snackbar.undo('Item removido');
    await flush();
    const action = toasts()[0].querySelector<HTMLButtonElement>('.toast__action')!;
    expect(action.textContent).toContain('Undo');
    action.click();
    expect(await first).toBe('undo');
    await vi.runAllTimersAsync();

    const second = snackbar.undo('Outro', { label: 'Desfazer', duration: 500 });
    await flush();
    expect(toasts()[0].querySelector('.toast__action')!.textContent).toContain('Desfazer');
    await vi.advanceTimersByTimeAsync(500);
    expect(await second).toBe('commit');
    await vi.runAllTimersAsync();

    const third = snackbar.undo('Mais um');
    await flush();
    snackbar.dismissAll();
    expect(await third).toBe('commit');
  });
});

describe('SnackbarService: focusHotkey', () => {
  it('Alt+T leva o foco ao toast mais recente e pausa; Esc fecha e devolve o foco', async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideShySnackbar({ focusHotkey: 'Alt+T' })] });
    const snackbar = TestBed.inject(SnackbarService);
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();

    const ref = snackbar.show('Com ação', { action: { label: 'Desfazer' }, duration: 1000 });
    await flush();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'T', code: 'KeyT', altKey: true, bubbles: true }));
    expect((document.activeElement as HTMLElement).className).toContain('toast__action');

    toasts()[0].dispatchEvent(new Event('focusin', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(5000);
    expect(texts()).toEqual(['Com ação']);

    toasts()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(await ref.closed).toBe('dismiss');
    expect(document.activeElement).toBe(origin);

    origin.remove();
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    vi.useRealTimers();
  });
});

describe('provideShySnackbar', () => {
  it('troca maxVisible e dismissLabel', async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideShySnackbar({ maxVisible: 1, dismissLabel: 'Fechar' })] });
    const snackbar = TestBed.inject(SnackbarService);
    snackbar.show('A', { duration: 0 });
    snackbar.show('B', { duration: 0 });
    await flush();
    expect(texts()).toEqual(['A']);
    expect(toasts()[0].querySelector('.toast__dismiss')!.getAttribute('aria-label')).toBe('Fechar');

    snackbar.dismissAll();
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    vi.useRealTimers();
  });
});
