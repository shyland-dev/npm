import { createShyLogger } from '../logger/shy-logger';

// Definido pelo build de produção do Angular (false). O guard literal permite ao bundler remover o código.
declare const ngDevMode: boolean | undefined;

/** Executa `fn` só em modo de desenvolvimento e devolve o resultado (`undefined` fora dele). */
export function shyDevOnly<T>(fn: () => T): T | undefined {
  return typeof ngDevMode === 'undefined' || ngDevMode ? fn() : undefined;
}

/** Lança `Error` quando `condition` é falsa, só em desenvolvimento. Em produção não faz nada. */
export function shyInvariant(condition: unknown, message: string): asserts condition {
  if ((typeof ngDevMode === 'undefined' || ngDevMode) && !condition) throw new Error(`[shy] invariant: ${message}`);
}

const warned = new Set<string>();

/** `console.warn` uma única vez por `name`, só em desenvolvimento. */
export function shyDeprecated(name: string, replacement?: string): void {
  if ((typeof ngDevMode !== 'undefined' && !ngDevMode) || warned.has(name)) return;
  warned.add(name);
  createShyLogger('deprecated').warn(`"${name}" está depreciado.${replacement ? ` Use "${replacement}".` : ''}`);
}

/** Zera o controle de `shyDeprecated` (para testes). */
export function resetShyDeprecations(): void {
  warned.clear();
}

/** Mede `fn` (síncrona ou Promise) com `performance.measure` e loga a duração, só em desenvolvimento. */
export function shyMeasure<T>(name: string, fn: () => T): T {
  if (typeof ngDevMode !== 'undefined' && !ngDevMode) return fn();
  const start = performance.now();
  const done = (): void => {
    const end = performance.now();
    try {
      performance.measure(`shy:${name}`, { start, end });
    } catch {
      // Sem suporte a User Timing: só o log.
    }
    createShyLogger('perf').debug(`${name}: ${(end - start).toFixed(2)}ms`);
  };
  const result = fn();
  const thenable = result as unknown as PromiseLike<unknown> | null;
  if (typeof thenable?.then === 'function') {
    thenable.then(done, done);
  } else {
    done();
  }
  return result;
}
