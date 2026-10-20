import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent, FormFieldComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-checkbox-page',
  imports: [CheckboxComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxPage {
  protected readonly states = ['rest', 'hover', 'focus'] as const;
  protected readonly all = signal(false);
  protected readonly items = signal([
    { name: 'Email', checked: true },
    { name: 'SMS', checked: false },
    { name: 'Push', checked: false },
  ]);
  protected readonly form = new FormGroup({ terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }) });

  protected readonly checkedCount = () => this.items().filter((i) => i.checked).length;
  protected readonly partial = () => this.checkedCount() > 0 && this.checkedCount() < this.items().length;

  protected toggleAll(checked: boolean): void {
    this.items.update((list) => list.map((i) => ({ ...i, checked })));
  }

  protected toggleItem(index: number, checked: boolean): void {
    this.items.update((list) => list.map((i, n) => (n === index ? { ...i, checked } : i)));
  }
}
