import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ShyInputSize } from '../../types/input/input.type';
import { IconComponent } from '../icon/icon.component';
import { ShyFieldControl, ShyFormFieldContext, SHY_FORM_FIELD } from './form-field.token';

let nextId = 0;

/**
 * Envolve um `<input shyInput>` ou `<textarea shyInput>` com rótulo, dica, erro e contador, e liga o ARIA:
 * `for`/`id`, `aria-describedby` (dica + erro), `aria-invalid` e `aria-errormessage`.
 *
 * - `error`: texto da mensagem; aparece (com ícone) quando o campo está inválido. O estado inválido vem do input
 *   `invalid` do campo ou do controle (`NgControl` inválido e tocado/alterado). O erro nunca é só cor.
 * - Slots `prefix` e `suffix` (`<shy-icon slot="prefix">`) ficam dentro da caixa do campo e abrem espaço no texto.
 * - `counter` mostra `n/maxlength`; `size` (sm | md | lg) prevalece sobre o `shyInput="…"` do controle.
 */
@Component({
  selector: 'shy-form-field',
  imports: [IconComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SHY_FORM_FIELD, useExisting: forwardRef(() => FormFieldComponent) }],
  host: {
    '[attr.data-invalid]': 'invalid() ? "" : null',
  },
})
export class FormFieldComponent implements ShyFormFieldContext {
  readonly label = input<string>();
  readonly hint = input<string>();
  /** Mensagem exibida enquanto o campo está inválido. */
  readonly error = input<string>();
  /** Força o estado inválido (ex.: erro do servidor); sem ele vale o do controle. */
  readonly invalidInput = input<boolean | undefined, boolean | '' | undefined>(undefined, { alias: 'invalid', transform: (v) => (v === undefined ? undefined : booleanAttribute(v)) });
  /** Marca o rótulo com `*`; o `required` do controle também marca. */
  readonly required = input(false, { transform: booleanAttribute });
  readonly counter = input(false, { transform: booleanAttribute });
  readonly sizeInput = input<ShyInputSize | undefined>(undefined, { alias: 'size' });

  private readonly uid = `shy-field-${nextId++}`;
  protected readonly hintId = `${this.uid}-hint`;
  protected readonly labelBoxId = `${this.uid}-label`;
  protected readonly errorBoxId = `${this.uid}-error`;
  protected readonly control = signal<ShyFieldControl | null>(null);

  readonly size = computed<ShyInputSize>(() => this.sizeInput() ?? this.control()?.size() ?? 'md');
  readonly invalid = computed(() => this.invalidInput() ?? this.control()?.invalid() ?? false);
  protected readonly showError = computed(() => this.invalid() && !!this.error());
  protected readonly isRequired = computed(() => this.required() || !!this.control()?.required());
  readonly labelId = computed(() => (this.label() ? this.labelBoxId : null));
  readonly errorId = computed(() => (this.showError() ? this.errorBoxId : null));
  readonly describedBy = computed(() => [this.hint() ? this.hintId : null, this.errorId()].filter(Boolean).join(' ') || null);
  protected readonly forId = computed(() => this.control()?.id() ?? null);
  protected readonly counterText = computed(() => {
    const length = this.control()?.valueLength() ?? 0;
    const max = this.control()?.maxLength();
    return max === undefined ? `${length}` : `${length}/${max}`;
  });

  attach(control: ShyFieldControl): void {
    this.control.set(control);
  }

  detach(control: ShyFieldControl): void {
    if (this.control() === control) this.control.set(null);
  }
}
