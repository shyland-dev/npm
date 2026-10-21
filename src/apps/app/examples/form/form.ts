import { afterNextRender, Component, computed, ElementRef, inject, Injector, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent, BadgeComponent, ButtonComponent, CardComponent, CheckboxComponent, DividerComponent, FormFieldComponent, IconComponent, InputComponent, ProgressComponent, RadioComponent, RadioGroupComponent, SwitchComponent } from '@shyland-dev/ui';

type FieldName = 'name' | 'email' | 'plan' | 'terms';

/** Exemplo de revisão cruzada da Onda 1: todos os controles dentro de shy-form-field num formulário reativo. */
@Component({
  selector: 'app-form-example',
  imports: [ReactiveFormsModule, AlertComponent, BadgeComponent, ButtonComponent, CardComponent, CheckboxComponent, DividerComponent, FormFieldComponent, IconComponent, InputComponent, ProgressComponent, RadioComponent, RadioGroupComponent, SwitchComponent],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class FormExample {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(200)] }),
    plan: new FormControl<string | null>(null, Validators.required),
    email_updates: new FormControl(true, { nonNullable: true }),
    sms_updates: new FormControl(false, { nonNullable: true }),
    public_profile: new FormControl(false, { nonNullable: true }),
    terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  private readonly required: FieldName[] = ['name', 'email', 'plan', 'terms'];
  private readonly labels: Record<FieldName, string> = { name: 'Name', email: 'Email', plan: 'Plan', terms: 'Terms' };

  // Signals do estado do formulário: a página roda zoneless, então o template só reage a signals.
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly done = computed(() => {
    this.status();
    this.value();
    return this.required.filter((name) => this.form.controls[name].valid).length;
  });
  protected readonly total = this.required.length;

  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly invalidFields = signal<string[]>([]);

  protected message(name: 'name' | 'email'): string {
    this.status();
    const errors = this.form.controls[name].errors;
    if (errors?.['required']) return 'This field is required';
    if (errors?.['minlength']) return 'Use at least 3 characters';
    if (errors?.['email']) return 'Enter a valid email';
    return '';
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    this.submitted.set(true);
    this.sent.set(false);
    this.invalidFields.set(this.required.filter((name) => this.form.controls[name].invalid).map((name) => this.labels[name]));
    if (this.form.invalid) {
      // Leva o foco ao primeiro campo inválido; o resumo no alerta é anunciado pelo role="status".
      afterNextRender(() => this.focusFirstInvalid(), { injector: this.injector });
      return;
    }

    this.sending.set(true);
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
    }, 1200);
  }

  // O radio group marca aria-invalid no host (role="radiogroup"), então o foco vai para o primeiro radio habilitado dele.
  private focusFirstInvalid(): void {
    const invalid = this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]');
    const target = invalid?.matches('input, textarea') ? invalid : invalid?.querySelector<HTMLElement>('input:not(:disabled)');
    target?.focus();
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.sent.set(false);
    this.invalidFields.set([]);
  }
}
