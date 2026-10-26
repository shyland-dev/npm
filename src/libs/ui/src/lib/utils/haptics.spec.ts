import { TestBed } from '@angular/core/testing';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { OverlayService } from '../overlay/overlay.service';
import { DrawerService } from '../services/drawer/drawer.service';
import { provideShySnackbar } from '../services/snackbar/snackbar.config';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { haptic } from './haptics';

describe('haptic', () => {
  let vibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
  });

  afterEach(() => {
    delete (navigator as { vibrate?: unknown }).vibrate;
    document.documentElement.removeAttribute('data-motion');
  });

  it('vibra o padrão pedido (10 ms por padrão)', () => {
    haptic(document);
    haptic(document, [10, 30, 10]);
    expect(vibrate).toHaveBeenNthCalledWith(1, 10);
    expect(vibrate).toHaveBeenNthCalledWith(2, [10, 30, 10]);
  });

  it('não vibra com reduced motion, sem suporte, sem interação prévia, e engole erros', () => {
    document.documentElement.setAttribute('data-motion', 'reduced');
    haptic(document);
    expect(vibrate).not.toHaveBeenCalled();
    document.documentElement.removeAttribute('data-motion');

    Object.defineProperty(navigator, 'userActivation', { value: { hasBeenActive: false }, configurable: true });
    haptic(document);
    expect(vibrate).not.toHaveBeenCalled();
    delete (navigator as { userActivation?: unknown }).userActivation;

    vibrate.mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(() => haptic(document)).not.toThrow();

    delete (navigator as { vibrate?: unknown }).vibrate;
    expect(() => haptic(document)).not.toThrow();
  });
});

describe('haptics opt-in', () => {
  let vibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
  });

  afterEach(async () => {
    delete (navigator as { vibrate?: unknown }).vibrate;
    await vi.runAllTimersAsync();
    await TestBed.inject(OverlayService).closeAll(false);
    document.documentElement.removeAttribute('data-shy-scroll-lock');
    vi.useRealTimers();
  });

  const flush = async () => {
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();
  };

  it('Snackbar: desligado por padrão; com haptics vibra ao fechar pelo X e não ao fechar por tempo', async () => {
    const snackbar = TestBed.inject(SnackbarService);
    snackbar.show('A', { duration: 0 });
    await flush();
    document.querySelector<HTMLButtonElement>('.toast__dismiss')!.click();
    expect(vibrate).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();
  });

  it('Snackbar com haptics: X vibra, timeout não', async () => {
    TestBed.configureTestingModule({ providers: [provideShySnackbar({ haptics: true })] });
    const snackbar = TestBed.inject(SnackbarService);
    snackbar.show('Some sozinho', { duration: 100 });
    await flush();
    await vi.advanceTimersByTimeAsync(100);
    expect(vibrate).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();

    snackbar.show('Fecha no X', { duration: 0 });
    await flush();
    document.querySelector<HTMLButtonElement>('.toast__dismiss')!.click();
    expect(vibrate).toHaveBeenCalledTimes(1);
    await vi.runAllTimersAsync();
  });

  it('Drawer: só vibra quando o arrasto fecha e haptics está ligado', async () => {
    const drawers = TestBed.inject(DrawerService);
    const drag = (pane: HTMLElement) => {
      const header = pane.querySelector<HTMLElement>('.header')!;
      const ev = (type: string, y: number, t: number) => {
        const e = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(e, { pointerId: { value: 1 }, isPrimary: { value: true }, pointerType: { value: 'touch' }, clientX: { value: 0 }, clientY: { value: y }, timeStamp: { value: t } });
        header.dispatchEvent(e);
      };
      ev('pointerdown', 0, 0);
      ev('pointermove', 100, 100);
      ev('pointermove', 300, 200);
      ev('pointerup', 300, 200);
    };

    const off = drawers.open(DrawerComponent, { side: 'bottom', dragToClose: true });
    Object.defineProperty(off.pane, 'offsetHeight', { value: 400 });
    drag(off.pane);
    expect(vibrate).not.toHaveBeenCalled();
    await vi.runAllTimersAsync();

    const on = drawers.open(DrawerComponent, { side: 'bottom', dragToClose: true, haptics: true });
    Object.defineProperty(on.pane, 'offsetHeight', { value: 400 });
    drag(on.pane);
    expect(vibrate).toHaveBeenCalledTimes(1);
  });
});
