import { afterNextRender, booleanAttribute, computed, DestroyRef, Directive, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SHY_FORM_FIELD } from '../form-field/form-field.token';

let nextId = 0;

/** `booleanAttribute` que mantém `undefined` (sem valor = "decida pelo NgControl"). */
export const optionalBoolean = (v: boolean | '' | undefined): boolean | undefined => (v === undefined ? undefined : booleanAttribute(v));

/**
 * Base interna dos controles de escolha (Checkbox, Switch, RadioGroup): CVA, `disabled`, `invalid`, `required`, `name`, `label`, `id`
 * e a ligação com o `shy-form-field`. O CVA é registrado pelo `NgControl` (sem `NG_VALUE_ACCESSOR`), o que evita a dependência circular.
 * Não é exportada.
 */
@Directive()
export abstract class ControlBase<T> implements ControlValueAccessor {
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected readonly field = inject(SHY_FORM_FIELD, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  readonly disabled = input(false, { transform: booleanAttribute });
  /** Força o estado inválido (ou válido com `false`); sem ele vale o `NgControl`. */
  readonly invalid = input<boolean | undefined, boolean | '' | undefined>(undefined, { transform: optionalBoolean });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string>();
  /** Nome acessível (`aria-label`) quando não há texto projetado. */
  readonly label = input<string>();
  readonly idInput = input<string | undefined>(undefined, { alias: 'id' });

  private readonly generatedId = `shy-control-${nextId++}`;
  readonly id = computed(() => this.idInput() || this.generatedId);

  private readonly cvaDisabled = signal(false);
  private readonly tick = signal(0);
  protected onChange: (value: T) => void = () => {};
  private onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  private readonly ownInvalid = computed(() => {
    this.tick();
    const forced = this.invalid();
    if (forced !== undefined) return forced;
    const control = this.ngControl?.control;
    return !!control && control.invalid && (control.touched || control.dirty);
  });
  readonly showInvalid = computed(() => (this.field ? this.field.invalid() : this.ownInvalid()));

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;

    const control = { id: this.id, required: this.required, size: signal('md' as const), invalid: this.ownInvalid, valueLength: signal(0), maxLength: signal(undefined) };
    this.field?.attach(control);
    this.destroyRef.onDestroy(() => this.field?.detach(control));

    // events cobre touched/pristine e o submit (markAllAsTouched), que não disparam blur.
    afterNextRender(() => this.ngControl?.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.tick.update((n) => n + 1)));
  }

  abstract writeValue(value: unknown): void;

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }

  /** Chamado no blur do controle nativo. */
  protected touched(): void {
    this.onTouched();
    this.tick.update((n) => n + 1);
  }
}
