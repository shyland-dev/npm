import { TestBed } from '@angular/core/testing';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { SnackbarComponent } from './snackbar.component';

function render() {
  const fixture = TestBed.createComponent(SnackbarComponent);
  fixture.detectChanges();
  const box = () => fixture.nativeElement.querySelector('.snackbar') as HTMLElement;
  return { fixture, snackbar: fixture.componentInstance, box };
}

describe('SnackbarComponent', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('começa escondida e é uma região de status', () => {
    const { box } = render();
    expect(box().classList.contains('snackbar--visible')).toBe(false);
    expect(box().getAttribute('role')).toBe('status');
    expect(box().getAttribute('aria-live')).toBe('polite');
    expect(box().querySelector('button')?.tabIndex).toBe(-1);
  });

  it('show() exibe o texto e fecha sozinha após o delay', () => {
    const { fixture, snackbar, box } = render();
    snackbar.show({ text: 'Olá', delay: 1000 });
    fixture.detectChanges();

    expect(box().classList.contains('snackbar--visible')).toBe(true);
    expect(box().textContent).toContain('Olá');
    expect(box().querySelector('button')?.tabIndex).toBe(0);

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--visible')).toBe(false);
  });

  it('delay 0 mantém aberta até dismiss()', () => {
    const { fixture, snackbar, box } = render();
    snackbar.show({ delay: 0 });
    vi.advanceTimersByTime(60_000);
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--visible')).toBe(true);

    box().querySelector('button')?.click();
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--visible')).toBe(false);
  });

  it('show() sobrescreve a posição', () => {
    const { fixture, snackbar, box } = render();
    snackbar.show({ position: 'top' });
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--top')).toBe(true);
    expect(box().classList.contains('snackbar--bottom')).toBe(false);
  });

  it('um novo show() reinicia o temporizador', () => {
    const { fixture, snackbar, box } = render();
    snackbar.show({ delay: 1000 });
    vi.advanceTimersByTime(800);
    snackbar.show({ delay: 1000 });
    vi.advanceTimersByTime(800);
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--visible')).toBe(true);

    vi.advanceTimersByTime(200);
    fixture.detectChanges();
    expect(box().classList.contains('snackbar--visible')).toBe(false);
  });
});

describe('SnackbarService', () => {
  it('delega show() para o elemento informado', () => {
    const element = { show: vi.fn() } as unknown as SnackbarComponent;
    TestBed.inject(SnackbarService).show({ element, position: 'top', delay: 10, text: 'x' });
    expect(element.show).toHaveBeenCalledWith({ position: 'top', delay: 10, text: 'x' });
  });
});
