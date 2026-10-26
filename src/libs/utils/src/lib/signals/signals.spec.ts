import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideShyPlatform } from '@shyland-dev/utils/testing';
import { injectShyMediaQuery, shyDebounced } from './signals';

describe('shyDebounced', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('só assume o último valor após o intervalo', () => {
    const source = signal('a');
    const debounced = TestBed.runInInjectionContext(() => shyDebounced(source, 100));
    expect(debounced()).toBe('a');
    source.set('b');
    TestBed.tick();
    vi.advanceTimersByTime(50);
    source.set('c');
    TestBed.tick();
    vi.advanceTimersByTime(99);
    expect(debounced()).toBe('a');
    vi.advanceTimersByTime(1);
    expect(debounced()).toBe('c');
  });
});

describe('injectShyMediaQuery', () => {
  it('acompanha mudanças e remove o listener ao destruir', () => {
    let handler: ((e: { matches: boolean }) => void) | undefined;
    const remove = vi.fn();
    vi.stubGlobal('matchMedia', undefined);
    const win = window as unknown as { matchMedia: unknown };
    const original = win.matchMedia;
    win.matchMedia = () => ({
      matches: false,
      addEventListener: (_: string, h: typeof handler) => (handler = h),
      removeEventListener: remove,
    });
    const q = TestBed.runInInjectionContext(() => injectShyMediaQuery('(hover: hover)'));
    expect(q()).toBe(false);
    handler?.({ matches: true });
    expect(q()).toBe(true);
    TestBed.resetTestingModule();
    expect(remove).toHaveBeenCalled();
    win.matchMedia = original;
    vi.unstubAllGlobals();
  });

  it('no servidor devolve o valor inicial', () => {
    TestBed.configureTestingModule({ providers: [provideShyPlatform('server')] });
    expect(TestBed.runInInjectionContext(() => injectShyMediaQuery('(x)', true))()).toBe(true);
  });
});
