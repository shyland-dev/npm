import { InjectionToken, Signal } from '@angular/core';

/** O que o `shy-radio-group` oferece aos `shy-radio` filhos. */
export interface ShyRadioGroupContext {
  readonly groupName: Signal<string>;
  readonly value: Signal<unknown>;
  readonly isDisabled: Signal<boolean>;
  readonly showInvalid: Signal<boolean>;
  select(value: unknown): void;
}

export const SHY_RADIO_GROUP = new InjectionToken<ShyRadioGroupContext>('SHY_RADIO_GROUP');
