import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, FormFieldComponent, IconComponent, InputComponent, ShyInputSize } from '@shyland-dev/ui';

@Component({
  selector: 'app-form-field-page',
  imports: [ReactiveFormsModule, FormFieldComponent, InputComponent, ButtonComponent, IconComponent],
  templateUrl: './form-field.html',
})
export class FormFieldPage {
  protected readonly sizes: ShyInputSize[] = ['sm', 'md', 'lg'];
  protected readonly sent = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    bio: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(80)] }),
  });

  protected message(name: 'name' | 'email'): string {
    const errors = this.form.controls[name].errors;
    if (errors?.['required']) return 'This field is required';
    if (errors?.['minlength']) return 'Use at least 3 characters';
    if (errors?.['email']) return 'Enter a valid email';
    return '';
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    this.sent.set(this.form.valid);
  }
}
