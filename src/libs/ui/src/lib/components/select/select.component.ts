import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, model, output, signal, TemplateRef, untracked, viewChild } from '@angular/core';
import { ShySelectOption, SelectionChangeEvent, SelectOption } from '../../interfaces/select/select.interface';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { Typeahead } from '../../utils/typeahead';
import { ControlBase } from '../toggle/control-base';
import { IconComponent } from '../icon/icon.component';

/**
 * Lista de escolha (APG "select-only combobox"): o foco fica no botão (`role="combobox"`) e a opção ativa é apontada por
 * `aria-activedescendant`; o painel (`role="listbox"`) abre pelo `OverlayService` (camada `dropdown`, mesma largura do botão,
 * vira para cima se faltar espaço) e funciona também dentro de um Dialog.
 *
 * - Valor: `ngModel`, `formControl`/`formControlName` ou `[(value)]`. Com `multiple` o valor é um array. `compareWith` compara objetos.
 * - Teclado: ↓/↑/Enter/Espaço abrem; ↓/↑/Home/End movem a opção ativa (pulando as desabilitadas); Enter/Espaço escolhem
 *   (em `multiple` alternam e o painel continua aberto); digitar salta para a opção que começa com a letra; Esc fecha; Tab fecha e segue.
 * - Dentro de `shy-form-field` o botão recebe `id`/`for` do label, `aria-describedby`, `aria-invalid` e `aria-errormessage`.
 * - Texto sem escolha: `placeholder` ou o conteúdo projetado.
 *
 * A API antiga (`selectOptions`, `selectedOption`, `onSelectionChange`) continua funcionando, marcada `@deprecated`, até a 1.0.
 */
@Component({
  selector: 'shy-select',
  exportAs: 'shySelect',
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
  },
})
export class SelectComponent extends ControlBase<unknown> {
  private readonly overlay = inject(OverlayService);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild.required<TemplateRef<ShyOverlayContext>>('panel');

  /** Opções (`value` de qualquer tipo). */
  readonly options = input<readonly ShySelectOption[]>([]);
  /** Valor escolhido: o valor da opção ou, com `multiple`, um array. Use `[(value)]`, `ngModel` ou `formControl`. */
  readonly value = model<unknown>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string>();
  /** Como comparar valores (padrão `===`); útil quando o valor é um objeto. */
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>((a, b) => a === b);
  readonly selectIcon = input('check');
  readonly dropdownIcon = input('chevron-down');

  /** @deprecated Use `options`. Removido na 1.0. */
  readonly selectOptions = input<readonly SelectOption[]>([]);
  /** @deprecated Use `[(value)]`, `ngModel` ou `formControl`. Removido na 1.0. */
  readonly selectedOption = input<string | null | undefined>(undefined);
  /** @deprecated Use `(valueChange)`, `ngModel` ou `formControl`. Removido na 1.0. */
  readonly onSelectionChange = output<SelectionChangeEvent>();

  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  private ref: ShyOverlayRef | null = null;
  private readonly search = new Typeahead();

  protected readonly items = computed<readonly ShySelectOption[]>(() => {
    const options = this.options();
    return options.length ? options : this.selectOptions();
  });
  protected readonly listId = computed(() => `${this.id()}-list`);
  protected readonly activeId = computed(() => (this.isOpen() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null));

  private readonly selectedValues = computed<unknown[]>(() => {
    const value = this.value();
    if (this.multiple()) return Array.isArray(value) ? value : [];
    return value === null || value === undefined ? [] : [value];
  });
  private readonly selectedItems = computed(() => this.items().filter((item) => this.isSelectedValue(item.value)));
  protected readonly display = computed(() =>
    this.selectedItems()
      .map((item) => item.label)
      .join(', '),
  );
  protected readonly firstImg = computed(() => (this.multiple() ? undefined : this.selectedItems()[0]?.img));

  constructor() {
    super();
    // API antiga: `selectedOption` (string) escolhe a opção; `undefined` = não usado, não mexe no valor do CVA.
    effect(() => {
      const legacy = this.selectedOption();
      if (legacy !== undefined) untracked(() => this.value.set(legacy));
    });
  }

  override writeValue(value: unknown): void {
    this.value.set(this.multiple() ? (Array.isArray(value) ? value : []) : (value ?? null));
  }

  protected isSelectedValue(value: unknown): boolean {
    return this.selectedValues().some((selected) => this.compareWith()(selected, value));
  }

  protected optionId(index: number): string {
    return `${this.id()}-opt-${index}`;
  }

  protected toggleOpen(): void {
    if (this.isOpen()) this.close();
    else this.open();
  }

  protected open(initial?: 'first' | 'last'): void {
    if (this.isOpen() || this.isDisabled()) return;
    const items = this.items();
    const ref = this.overlay.open(this.panel(), {
      layer: 'dropdown',
      modal: false,
      anchor: this.trigger().nativeElement,
      position: { placement: 'bottom-start', matchWidth: true },
      closeOnOutsideClick: true,
      restoreFocus: false,
      initialFocus: 'none',
    });
    this.ref = ref;
    this.isOpen.set(true);
    const selected = items.findIndex((item) => this.isSelectedValue(item.value) && !item.disabled);
    this.activeIndex.set(initial === 'last' ? this.edge(-1) : initial === 'first' || selected < 0 ? this.edge(1) : selected);
    this.reveal();
    void ref.closed.then(() => {
      if (this.ref !== ref) return;
      this.ref = null;
      this.isOpen.set(false);
      this.activeIndex.set(-1);
    });
  }

  protected close(): void {
    void this.ref?.close();
  }

  /** Primeiro (`1`) ou último (`-1`) índice habilitado. */
  private edge(direction: 1 | -1): number {
    const items = this.items();
    const order = items.map((_, i) => i);
    if (direction < 0) order.reverse();
    return order.find((i) => !items[i].disabled) ?? -1;
  }

  private move(delta: 1 | -1): number {
    const items = this.items();
    const n = items.length;
    let index = this.activeIndex();
    for (let step = 0; step < n; step++) {
      index = (index + delta + n) % n;
      if (!items[index].disabled) return index;
    }
    return -1;
  }

  protected choose(index: number): void {
    const item = this.items()[index];
    if (!item || item.disabled) return;
    this.activeIndex.set(index);
    if (this.multiple()) {
      const current = this.selectedValues();
      const next = this.isSelectedValue(item.value) ? current.filter((v) => !this.compareWith()(v, item.value)) : [...current, item.value];
      this.commit(next);
    } else {
      this.commit(item.value);
      this.onSelectionChange.emit({ selectedOption: item as SelectOption });
      this.close();
    }
  }

  private commit(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key;

    if (!this.isOpen()) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        this.open(key === 'ArrowUp' ? 'last' : undefined);
      } else if (key.length === 1) {
        event.preventDefault();
        this.open();
        this.typeahead(key);
      }
      return;
    }

    switch (key) {
      case 'ArrowDown':
        this.activeIndex.set(this.move(1));
        break;
      case 'ArrowUp':
        this.activeIndex.set(this.move(-1));
        break;
      case 'Home':
        this.activeIndex.set(this.edge(1));
        break;
      case 'End':
        this.activeIndex.set(this.edge(-1));
        break;
      case 'Enter':
      case ' ':
        this.choose(this.activeIndex());
        break;
      case 'Tab':
        // Sem preventDefault: o foco segue pela página; o blur fecha o painel.
        return;
      default:
        if (key.length === 1) this.typeahead(key);
        else return;
    }
    event.preventDefault();
    this.reveal();
  }

  protected onKeyup(event: KeyboardEvent): void {
    // Espaço ativa o botão no keyup em alguns navegadores, mesmo com o keydown cancelado.
    if (event.key === ' ') event.preventDefault();
  }

  protected onBlur(): void {
    this.close();
    this.touched();
  }

  private typeahead(char: string): void {
    const items = this.items();
    const index = this.search.find(
      items.map((item) => item.label),
      this.activeIndex(),
      char,
      (i) => !!items[i].disabled,
    );
    if (index >= 0) this.activeIndex.set(index);
    this.reveal();
  }

  /** Mantém a opção ativa visível dentro do painel rolável. */
  private reveal(): void {
    const index = this.activeIndex();
    queueMicrotask(() => document.getElementById(this.optionId(index))?.scrollIntoView?.({ block: 'nearest' }));
  }
}
