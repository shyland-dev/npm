import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model } from '@angular/core';
import { ShyRadioOrientation } from '../../types/radio/radio.type';
import { ControlBase } from '../toggle/control-base';
import { ShyRadioGroupContext, SHY_RADIO_GROUP } from './radio.token';

let nextId = 0;

/**
 * Grupo de `shy-radio`: `role="radiogroup"`, valor único por `[(value)]` ou `ngModel`/`formControl` (CVA com o `value` do radio).
 * Cada `shy-radio` é um `<input type="radio">` nativo com o mesmo `name`; o navegador cuida do roving tabindex
 * (Tab entra no marcado, ou no primeiro) e das setas, que movem e selecionam, pulando os desabilitados.
 *
 * Dê um nome ao grupo com `label` (`aria-label`) ou deixe o `shy-form-field` fazê-lo (`aria-labelledby` do rótulo do campo).
 */
@Component({
  selector: 'shy-radio-group',
  exportAs: 'shyRadioGroup',
  template: '<ng-content />',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SHY_RADIO_GROUP, useExisting: forwardRef(() => RadioGroupComponent) }],
  host: {
    role: 'radiogroup',
    '[attr.id]': 'id()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
    '[attr.aria-label]': 'label() ?? null',
    '[attr.aria-labelledby]': 'label() ? null : (field?.labelId() ?? null)',
    '[attr.aria-required]': 'required() ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-invalid]': 'showInvalid() ? "true" : null',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-errormessage]': 'showInvalid() ? (field?.errorId() ?? null) : null',
    '(focusout)': 'leaving($event)',
  },
})
export class RadioGroupComponent extends ControlBase<unknown> implements ShyRadioGroupContext {
  /** Valor do radio marcado. `undefined` = nenhum. */
  readonly value = model<unknown>(undefined);
  readonly orientation = input<ShyRadioOrientation>('vertical');

  private readonly generatedName = `shy-radio-group-${nextId++}`;
  /** `name` nativo compartilhado pelos radios (é o que liga as setas); `name` do grupo ou um gerado. */
  readonly groupName = computed(() => this.name() || this.generatedName);

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  select(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
  }

  /** Só marca como tocado quando o foco sai do grupo (não ao mover entre radios). */
  protected leaving(event: FocusEvent): void {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.touched();
  }
}
