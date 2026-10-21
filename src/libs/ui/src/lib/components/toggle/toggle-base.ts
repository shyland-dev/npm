import { Directive, input, model } from '@angular/core';
import { ControlBase } from './control-base';

/** Base interna de Checkbox e Switch: o valor é o `checked` (`model()`), refletido no input nativo. Não é exportada. */
@Directive()
export abstract class ToggleBase extends ControlBase<boolean> {
  readonly checked = model(false);
  /** Valor nativo do input (envio em `<form>`). */
  readonly value = input<string>();

  writeValue(value: unknown): void {
    this.checked.set(!!value);
  }

  /** Chamado pelo `(change)` do input nativo. */
  protected toggled(input: HTMLInputElement): void {
    this.checked.set(input.checked);
    this.onChange(input.checked);
  }
}
