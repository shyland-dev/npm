import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent, RadioComponent, RadioGroupComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-radio-page',
  imports: [RadioGroupComponent, RadioComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './radio.html',
})
export class RadioPage {
  protected readonly plan = signal<string>('pro');
  protected readonly form = new FormGroup({ size: new FormControl<string | null>(null, Validators.required) });
}
