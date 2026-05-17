import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SelectionChangeEvent, SelectOption } from '../../interfaces/select/select.interface';

@Component({
  selector: 'shy-select',
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnChanges, OnDestroy {
  @Input() selectOptions: SelectOption[] = [];
  @Input() selectIcon = 'check';
  @Input() dropdownIcon = 'chevron-down';
  @Input() selectedOption: string | null = null;

  @Output() onSelectionChange = new EventEmitter<SelectionChangeEvent>();

  currentOption: SelectOption | null = null;
  isOpen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectOptions'] || changes['selectedOption']) {
      if (this.selectedOption && this.selectOptions.length) {
        this.currentOption = this.selectOptions.find((o) => o.value === this.selectedOption) ?? null;
        this.cdr.markForCheck();
      }
    }
  }

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
    this.currentOption = option;
    this.isOpen = false;
    this.onSelectionChange.emit({ selectedOption: option });
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {}
}
