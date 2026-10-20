import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SHY_RADIO_GROUP } from './radio.token';

/**
 * Opção de um `shy-radio-group`, sobre `<input type="radio">` nativo. `value` pode ser qualquer valor (comparado com `Object.is`);
 * o texto vem do conteúdo projetado ou de `label` (`aria-label`). Fora de um grupo não funciona.
 */
@Component({
  selector: 'shy-radio',
  exportAs: 'shyRadio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'invalid() ? "" : null',
  },
})
export class RadioComponent {
  private readonly group = inject(SHY_RADIO_GROUP);

  readonly value = input.required<unknown>();
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Nome acessível (`aria-label`) quando não há texto projetado. */
  readonly label = input<string>();

  protected readonly name = this.group.groupName;
  protected readonly checked = computed(() => Object.is(this.group.value(), this.value()));
  protected readonly isDisabled = computed(() => this.disabled() || this.group.isDisabled());
  /** O estado inválido é do grupo; o radio só o repete para pintar a borda. */
  protected readonly invalid = this.group.showInvalid;
  /** `value` nativo só para string/número (envio em `<form>`); outros tipos ficam sem. */
  protected readonly nativeValue = computed(() => {
    const v = this.value();
    return typeof v === 'string' || typeof v === 'number' ? String(v) : null;
  });

  protected select(): void {
    this.group.select(this.value());
  }
}
