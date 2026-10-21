import { computed, Directive, input, Signal } from '@angular/core';

/** `null`, `undefined` ou vazio = indeterminado. */
export function toProgressValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Máximo inválido ou ≤ 0 volta para 100. */
export function toProgressMax(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

/** Inputs e derivados comuns ao Progress linear e ao ProgressCircular. */
@Directive()
export abstract class ProgressBase {
  /** Valor atual; sem valor (`null`) a barra fica indeterminada. */
  readonly value = input<number | null, unknown>(null, { transform: toProgressValue });
  readonly max = input<number, unknown>(100, { transform: toProgressMax });
  /** Nome acessível (`aria-label`). Sem ele, use `aria-labelledby` no elemento. */
  readonly label = input<string>();

  protected readonly indeterminate = computed(() => this.value() === null);
  /** Valor limitado a [0, max], para `aria-valuenow`. */
  protected readonly now: Signal<number | null> = computed(() => {
    const value = this.value();
    return value === null ? null : Math.min(Math.max(value, 0), this.max());
  });
  /** Fração de 0 a 1, para o CSS. */
  protected readonly ratio = computed(() => (this.now() ?? 0) / this.max());
}

/** Host bindings de `role="progressbar"` (APG). */
export const PROGRESS_HOST = {
  role: 'progressbar',
  'aria-valuemin': '0',
  '[attr.aria-valuemax]': 'max()',
  '[attr.aria-valuenow]': 'now()',
  '[attr.aria-label]': 'label() || null',
  '[attr.data-indeterminate]': 'indeterminate() ? "" : null',
  '[style.--_value]': 'ratio()',
};
