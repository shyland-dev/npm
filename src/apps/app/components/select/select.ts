import { Component, signal } from '@angular/core';
import { SelectComponent, SelectionChangeEvent, SelectOption } from '@shyland-dev/ui';

@Component({
  selector: 'app-select-page',
  imports: [SelectComponent],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class SelectPage {
  protected readonly options: SelectOption[] = [
    { id: 0, value: 'br', label: 'Brasil', img: 'assets/imgs/flag-br.svg' },
    { id: 1, value: 'test2', label: 'This is awesome' },
    { id: 2, value: 'test3', label: 'Testing the select with a very long label that gets truncated' },
  ];

  protected readonly selected = signal<string | null>(null);
  protected readonly last = signal('none');

  protected change(event: SelectionChangeEvent): void {
    this.selected.set(event.selectedOption.value);
    this.last.set(event.selectedOption.label);
  }
}
