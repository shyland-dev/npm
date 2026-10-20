import { InjectionToken, Signal } from '@angular/core';
import { ShyInputSize } from '../../types/input/input.type';

/** O que o controle (`shyInput`) informa ao `shy-form-field` que o envolve. */
export interface ShyFieldControl {
  readonly id: Signal<string>;
  readonly required: Signal<boolean>;
  /** Tamanho pedido no próprio controle; o `size` do campo, se houver, prevalece. */
  readonly size: Signal<ShyInputSize>;
  /** Estado inválido do controle: input `invalid` ou, sem ele, `NgControl` inválido e (touched ou dirty). */
  readonly invalid: Signal<boolean>;
  readonly valueLength: Signal<number>;
  readonly maxLength: Signal<number | undefined>;
}

/** O que o `shy-form-field` devolve ao controle: ids para ARIA e o estado final. */
export interface ShyFormFieldContext {
  readonly size: Signal<ShyInputSize>;
  readonly invalid: Signal<boolean>;
  readonly describedBy: Signal<string | null>;
  /** Id da mensagem de erro, só enquanto ela está visível. */
  readonly errorId: Signal<string | null>;
  attach(control: ShyFieldControl): void;
  detach(control: ShyFieldControl): void;
}

export const SHY_FORM_FIELD = new InjectionToken<ShyFormFieldContext>('SHY_FORM_FIELD');
