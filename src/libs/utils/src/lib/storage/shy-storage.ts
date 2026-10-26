import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, PLATFORM_ID, WritableSignal, inject, signal } from '@angular/core';
import { assertShyInjectionContext } from '../di/di';

export interface ShyStorageOptions<T> {
  /** Padrão: `local`. */
  storage?: 'local' | 'session';
  /** Valida o valor lido (JSON). Se falhar, usa o `fallback`. */
  validate?: (value: unknown) => value is T;
}

/**
 * Signal gravável persistido em `localStorage`/`sessionStorage` como JSON. Chame em contexto de injeção.
 * No servidor, ou com storage indisponível, funciona como um `signal` comum. Sincroniza entre abas.
 */
export function shyStorage<T>(key: string, fallback: T, options: ShyStorageOptions<T> = {}): WritableSignal<T> {
  assertShyInjectionContext(shyStorage);
  const win = inject(DOCUMENT).defaultView;
  const store = getStore(isPlatformBrowser(inject(PLATFORM_ID)) ? win : null, options.storage ?? 'local');

  const read = (): T => {
    try {
      const raw = store?.getItem(key);
      if (raw == null) return fallback;
      const value: unknown = JSON.parse(raw);
      return !options.validate || options.validate(value) ? (value as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const state = signal<T>(read());
  const setState = state.set.bind(state);
  state.set = (value: T) => {
    setState(value);
    try {
      store?.setItem(key, JSON.stringify(value));
    } catch {
      // Cota cheia ou storage bloqueado: mantém só em memória.
    }
  };
  state.update = (fn) => state.set(fn(state()));

  if (store && win) {
    const onStorage = (event: StorageEvent): void => {
      if (event.storageArea === store && event.key === key) setState(read());
    };
    win.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => win.removeEventListener('storage', onStorage));
  }
  return state;
}

function getStore(win: Window | null, kind: 'local' | 'session'): Storage | null {
  try {
    return (kind === 'local' ? win?.localStorage : win?.sessionStorage) ?? null;
  } catch {
    return null;
  }
}
