import { DestroyRef, effect, inject, Injector, signal, Signal, untracked } from '@angular/core';

export interface DelayedFlagOptions {
  /** Só liga depois de a origem ficar `true` por este tempo (ms); cargas mais rápidas nunca mostram nada. Padrão: 200. */
  delay?: number;
  /** Depois de ligar, fica ligada ao menos este tempo (ms), para o indicador não piscar. Padrão: 400. */
  minDuration?: number;
  /** Fora de um contexto de injeção. */
  injector?: Injector;
}

/**
 * Indicador de carregamento sem flicker: devolve um signal que acompanha `source`, mas só liga após `delay` e, uma vez ligado,
 * não desliga antes de `minDuration`. Use no `shy-skeleton`/`shy-spinner` (e no `aria-busy` do contêiner). Precisa de contexto
 * de injeção (ou `options.injector`); os timers são limpos junto com o dono.
 */
export function delayedFlag(source: Signal<boolean>, options: DelayedFlagOptions = {}): Signal<boolean> {
  const injector = options.injector ?? inject(Injector);
  const destroyRef = injector.get(DestroyRef);
  const { delay = 200, minDuration = 400 } = options;
  const shown = signal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let shownAt = 0;

  const clear = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  effect(
    () => {
      const on = source();
      untracked(() => {
        clear();
        if (on && !shown()) {
          timer = setTimeout(() => {
            shownAt = Date.now();
            shown.set(true);
          }, delay);
        } else if (!on && shown()) {
          const rest = minDuration - (Date.now() - shownAt);
          if (rest > 0) timer = setTimeout(() => shown.set(false), rest);
          else shown.set(false);
        }
      });
    },
    { injector },
  );
  destroyRef.onDestroy(clear);
  return shown.asReadonly();
}
