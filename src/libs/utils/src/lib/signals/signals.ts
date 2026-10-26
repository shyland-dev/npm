import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, PLATFORM_ID, Signal, effect, inject, signal, untracked } from '@angular/core';
import { assertShyInjectionContext } from '../di/di';

/** Signal do resultado de uma media query (`prefers-reduced-motion`, `forced-colors`, `hover`...). `initial` vale no servidor. */
export function injectShyMediaQuery(query: string, initial = false): Signal<boolean> {
  assertShyInjectionContext(injectShyMediaQuery);
  const win = inject(DOCUMENT).defaultView;
  if (!isPlatformBrowser(inject(PLATFORM_ID)) || !win?.matchMedia) return signal(initial).asReadonly();

  const mql = win.matchMedia(query);
  const state = signal(mql.matches);
  const onChange = (event: MediaQueryListEvent): void => state.set(event.matches);
  mql.addEventListener('change', onChange);
  inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', onChange));
  return state.asReadonly();
}

/** Signal derivado que só assume o valor de `source` depois de `ms` sem mudanças. Chame em contexto de injeção. */
export function shyDebounced<T>(source: Signal<T>, ms: number): Signal<T> {
  assertShyInjectionContext(shyDebounced);
  const state = signal(untracked(source));
  effect((onCleanup) => {
    const value = source();
    const id = setTimeout(() => state.set(value), ms);
    onCleanup(() => clearTimeout(id));
  });
  return state.asReadonly();
}
