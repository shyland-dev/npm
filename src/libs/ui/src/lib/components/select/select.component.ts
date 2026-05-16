import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SelectionChangeEvent, SelectOption } from '../../interfaces/select/select.interface';

@Component({
  selector: 'shy-select',
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnDestroy {
  @Input() selectOptions: SelectOption[] = [];
  @Input() selectIcon = 'check';
  @Input() dropdownIcon = 'chevron-down';

  @Output() onSelectionChange = new EventEmitter<SelectionChangeEvent>();

  selectedOption: SelectOption | null = null;
  isOpen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.cdr.markForCheck();
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.cdr.markForCheck();
  }

  selectOption(option: SelectOption): void {
    this.selectedOption = option;
    this.isOpen = false;
    this.onSelectionChange.emit({ selectedOption: option });
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void { }
}
