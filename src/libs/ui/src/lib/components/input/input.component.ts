import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { ShyInputSize } from '../../types/input/input.type';
import { ShyFieldControl, SHY_FORM_FIELD } from '../form-field/form-field.token';

let nextId = 0;

/**
 * Campo de texto sobre o elemento nativo: `<input shyInput>` ou `<textarea shyInput>`.
 * O nativo continua funcionando com `ngModel`, `formControl` e `formControlName`; não há ControlValueAccessor próprio.
 *
 * Dentro de `<shy-form-field>` o controle recebe `id`/`for`, `aria-describedby`, `aria-invalid` e `aria-errormessage` do campo.
 * `shyInput="lg"` escolhe o tamanho (sm | md | lg); `invalid` força o estado, senão ele vem do `NgControl`
 * (inválido e tocado ou alterado). Estado `invalid` nunca é só cor: o campo mostra ícone e texto.
 */
@Component({
  selector: 'input[shyInput], textarea[shyInput]',
  exportAs: 'shyInput',
  template: '',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'id()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
    '[attr.aria-invalid]': 'showInvalid() ? "true" : null',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
    '[attr.aria-errormessage]': 'showInvalid() ? (field?.errorId() ?? null) : null',
    '[attr.required]': 'required() ? "" : null',
    '[attr.maxlength]': 'maxlength() ?? null',
    '(input)': 'valueLength.set(el.value.length)',
    '(blur)': 'touchedTick.update((n) => n + 1)',
  },
})
export class InputComponent {
  protected readonly el: HTMLInputElement | HTMLTextAreaElement = inject(ElementRef).nativeElement;
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly destroyRef = inject(DestroyRef);
  protected readonly field = inject(SHY_FORM_FIELD, { optional: true });

  /** Tamanho: `shyInput="sm"`. Dentro de `shy-form-field` com `size`, o do campo vale. */
  readonly shyInput = input<ShyInputSize | ''>('md');
  /** Substitui o `id` gerado (o `for` do label do campo acompanha). */
  readonly idInput = input<string | undefined>(undefined, { alias: 'id' });
  /** Força o estado inválido (ou válido com `false`); sem ele vale o `NgControl`. */
  readonly invalid = input<boolean | undefined, boolean | '' | undefined>(undefined, { transform: (v) => (v === undefined ? undefined : booleanAttribute(v)) });
  readonly required = input(false, { transform: booleanAttribute });
  readonly maxlength = input<number | undefined, number | string | null | undefined>(undefined, { transform: (v) => (v == null || v === '' ? undefined : Number(v)) });

  private readonly generatedId = `shy-input-${nextId++}`;
  protected readonly touchedTick = signal(0);
  readonly id = computed(() => this.idInput() || this.generatedId);
  readonly size = computed<ShyInputSize>(() => this.shyInput() || 'md');
  protected readonly valueLength = signal(0);

  /** Estado próprio: `invalid` explícito ou `NgControl` inválido e tocado/alterado. */
  private readonly ownInvalid = computed(() => {
    this.touchedTick();
    const forced = this.invalid();
    if (forced !== undefined) return forced;
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.touched || control.dirty);
  });
  protected readonly effectiveSize = computed(() => this.field?.size() ?? this.size());
  protected readonly showInvalid = computed(() => (this.field ? this.field.invalid() : this.ownInvalid()));

  constructor() {
    const control: ShyFieldControl = { id: this.id, required: this.required, size: this.size, invalid: this.ownInvalid, valueLength: this.valueLength, maxLength: this.maxlength };
    this.field?.attach(control);
    this.destroyRef.onDestroy(() => this.field?.detach(control));

    afterNextRender(() => {
      this.valueLength.set(this.el.value.length);
      // events: valor, status e touched/pristine; cobre o submit (markAllAsTouched), que não dispara blur.
      this.ngControl?.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.touchedTick.update((n) => n + 1);
        this.valueLength.set(this.el.value.length);
      });
    });
  }
}
