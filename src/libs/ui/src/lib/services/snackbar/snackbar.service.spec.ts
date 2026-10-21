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

  it('API antiga: show({ element }) delega ao <shy-snackbar>', () => {
    const element = { show: vi.fn() } as never;
    snackbar.show({ element, position: 'top', delay: 10, text: 'x' });
    expect((element as { show: ReturnType<typeof vi.fn> }).show).toHaveBeenCalledWith({ position: 'top', delay: 10, text: 'x' });
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
