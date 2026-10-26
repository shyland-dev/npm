import { DestroyRef, PLATFORM_ID, assertInInjectionContext, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Garante contexto de injeção; passe a função pública chamadora para a mensagem de erro apontar para ela. */
export function assertShyInjectionContext(caller: Function): void {
  assertInInjectionContext(caller);
}

/** Registra limpeza no `DestroyRef` atual e devolve a função que cancela o registro. */
export function onShyDestroy(callback: () => void): () => void {
  assertShyInjectionContext(onShyDestroy);
  return inject(DestroyRef).onDestroy(callback);
}

export interface ShyPlatform {
  readonly isBrowser: boolean;
  readonly isServer: boolean;
}

export function injectShyPlatform(): ShyPlatform {
  assertShyInjectionContext(injectShyPlatform);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  return { isBrowser, isServer: !isBrowser };
}
