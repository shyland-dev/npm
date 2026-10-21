import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, DialogComponent, DialogService, FormFieldComponent, SelectComponent, SelectionChangeEvent, SelectOption, ShySelectOption } from '@shyland-dev/ui';

@Component({
  selector: 'app-select-in-dialog',
  imports: [DialogComponent, SelectComponent, FormFieldComponent, FormsModule],
  template: `
    <shy-dialog heading="Select inside a dialog" closeLabel="Close dialog">
      <shy-form-field label="Country" hint="The list opens above the dialog and stays clickable.">
        <shy-select [options]="countries" [(ngModel)]="country" placeholder="Choose a country" />
      </shy-form-field>
    </shy-dialog>
  `,
})
export class SelectInDialog {
  protected readonly countries: ShySelectOption[] = [
    { value: 'br', label: 'Brazil', img: 'assets/imgs/flag-br.svg' },
    { value: 'us', label: 'United States', img: 'assets/imgs/flag-us.svg' },
    { value: 'pt', label: 'Portugal' },
  ];
  protected country: string | null = null;
}

@Component({
  selector: 'app-select-page',
  imports: [SelectComponent, FormFieldComponent, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class SelectPage {
  private readonly dialogs = inject(DialogService);

  protected readonly countries: ShySelectOption[] = [
    { value: 'br', label: 'Brazil', img: 'assets/imgs/flag-br.svg' },
    { value: 'us', label: 'United States', img: 'assets/imgs/flag-us.svg' },
    { value: 'pt', label: 'Portugal' },
    { value: 'jp', label: 'Japan (unavailable)', disabled: true },
    { value: 'long', label: 'A country with a very long name that gets truncated in the button and in the list' },
  ];
  protected readonly selected = signal<unknown>('us');
  protected readonly tags: ShySelectOption[] = ['Angular', 'TypeScript', 'CSS', 'Accessibility', 'Testing'].map((label) => ({ value: label.toLowerCase(), label }));
  protected readonly required = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  protected readonly legacyOptions: SelectOption[] = [
    { id: 0, value: 'br', label: 'Brasil' },
    { id: 1, value: 'us', label: 'United States' },
  ];
  protected readonly legacySelected = signal<string | null>(null);
  protected readonly last = signal('none');

  protected legacyChange(event: SelectionChangeEvent): void {
    this.legacySelected.set(event.selectedOption.value);
    this.last.set(event.selectedOption.label);
  }

  protected openDialog(): void {
    this.dialogs.open(SelectInDialog);
  }
}
