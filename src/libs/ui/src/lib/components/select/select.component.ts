import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, input, linkedSignal, output, signal, viewChild, viewChildren } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SelectionChangeEvent, SelectOption } from '../../interfaces/select/select.interface';

let nextId = 0;

@Component({
  selector: 'shy-select',
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class SelectComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly optionEls = viewChildren<ElementRef<HTMLElement>>('optionEl');

  readonly selectOptions = input<SelectOption[]>([]);
  readonly selectIcon = input('check');
  readonly dropdownIcon = input('chevron-down');
  readonly selectedOption = input<string | null>(null);

  readonly onSelectionChange = output<SelectionChangeEvent>();

  protected readonly uid = `shy-select-${nextId++}`;
  protected readonly isOpen = signal(false);
  protected readonly currentOption = linkedSignal<SelectOption | null>(() => {
    const value = this.selectedOption();
    return value ? (this.selectOptions().find((o) => o.value === value) ?? null) : null;
  });
  private readonly selectedIndex = computed(() => this.selectOptions().findIndex((o) => o.id === this.currentOption()?.id));

  protected onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.isOpen.set(false);
  }

  protected toggleDropdown(): void {
    if (this.isOpen()) this.isOpen.set(false);
    else this.open();
  }

  protected selectOption(option: SelectOption): void {
    this.currentOption.set(option);
    this.isOpen.set(false);
    this.onSelectionChange.emit({ selectedOption: option });
    this.trigger().nativeElement.focus();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.open();
  }

  protected onListKeydown(event: KeyboardEvent): void {
    const options = this.optionEls().map((o) => o.nativeElement);
    const current = options.indexOf(event.target as HTMLElement);
    const move = (index: number) => {
      event.preventDefault();
      options[(index + options.length) % options.length]?.focus();
    };

    switch (event.key) {
      case 'ArrowDown':
        return move(current + 1);
      case 'ArrowUp':
        return move(current - 1);
      case 'Home':
        return move(0);
      case 'End':
        return move(options.length - 1);
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = this.selectOptions()[current];
        if (option) this.selectOption(option);
        return;
      }
      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        this.trigger().nativeElement.focus();
        return;
      case 'Tab':
        this.isOpen.set(false);
        return;
    }
  }

  private open(): void {
    this.isOpen.set(true);
    afterNextRender(() => this.optionEls()[Math.max(this.selectedIndex(), 0)]?.nativeElement.focus(), { injector: this.injector });
  }
}
