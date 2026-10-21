import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, FormFieldComponent, ShySelectOption } from '@shyland-dev/ui';

@Component({
  selector: 'app-combobox-page',
  imports: [ComboboxComponent, FormFieldComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './combobox.html',
})
export class ComboboxPage {
  protected readonly countries: ShySelectOption[] = [
    { value: 'br', label: 'Brazil' },
    { value: 'us', label: 'United States' },
    { value: 'pt', label: 'Portugal' },
    { value: 'jp', label: 'Japan (unavailable)', disabled: true },
    { value: 'es', label: 'España' },
    { value: 'long', label: 'A country with a very long name that gets truncated in the field and in the list' },
  ];
  protected readonly selected = signal<unknown>('pt');
  protected readonly required = new FormControl<string | null>(null, Validators.required);
  protected readonly startsWith = (option: ShySelectOption, query: string) => option.label.toLowerCase().startsWith(query.toLowerCase());
}
