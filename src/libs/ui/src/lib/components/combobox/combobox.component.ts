import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, model, signal, TemplateRef, untracked, viewChild } from '@angular/core';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShySelectOption } from '../../interfaces/select/select.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { IconComponent } from '../icon/icon.component';
import { ControlBase } from '../toggle/control-base';

/** Texto sem acento nem caixa, para o filtro padrão. */
const fold = (text: string): string => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * Campo de texto com lista de sugestões (APG "combobox with list autocomplete"): o foco fica no `<input role="combobox">` e a opção
 * ativa é apontada por `aria-activedescendant`; o painel (`role="listbox"`) abre pelo `OverlayService` (mesma largura do campo).
 * Mesma forma de opção e de valor do `shy-select` (`ShySelectOption`, `compareWith`, `[(value)]`, `ngModel`, `formControl`), com valor único.
 *
 * - Só se escolhe uma opção da lista (sem valor livre). Ao sair do campo o texto volta ao rótulo da opção escolhida; apagar o texto limpa o valor.
 * - Filtro: `contains`, sem acento nem caixa; `filterFn` substitui. A lista não filtra enquanto o texto é só o rótulo da escolha.
 * - Teclado: digitar abre e filtra; ↓/↑ movem a opção ativa (↓ abre); Enter escolhe; Esc fecha e restaura o texto; Tab fecha e segue;
 *   Home/End continuam movendo o cursor do texto.
 * - Sem resultado, o painel mostra `emptyText` numa região `role="status"`.
 */
@Component({
  selector: 'shy-combobox',
  exportAs: 'shyCombobox',
  imports: [IconComponent],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
  },
})
export class ComboboxComponent extends ControlBase<unknown> {
  private readonly overlay = inject(OverlayService);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly panel = viewChild.required<TemplateRef<ShyOverlayContext>>('panel');

  readonly options = input<readonly ShySelectOption[]>([]);
  /** Valor da opção escolhida (`null` sem escolha). Use `[(value)]`, `ngModel` ou `formControl`. */
  readonly value = model<unknown>(null);
  readonly placeholder = input<string>();
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>((a, b) => a === b);
  /** Decide se a opção aparece para o texto digitado; o padrão é `contains` sem acento nem caixa. */
  readonly filterFn = input<(option: ShySelectOption, query: string) => boolean>((option, query) => fold(option.label).includes(fold(query)));
  readonly emptyText = input('No results');
  readonly dropdownIcon = input('chevron-down');

  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly query = signal('');
  /** `true` depois que o usuário digitou: só então a lista é filtrada. */
  private readonly filtering = signal(false);
  private ref: ShyOverlayRef | null = null;

  protected readonly listId = computed(() => `${this.id()}-list`);
  protected readonly visible = computed(() => {
    const options = this.options();
    return this.filtering() ? options.filter((option) => this.filterFn()(option, this.query())) : options;
  });
  protected readonly activeId = computed(() => (this.isOpen() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null));
  private readonly selectedOption = computed(() => this.options().find((option) => this.compareWith()(option.value, this.value())));

  constructor() {
    super();
    // Valor vindo de fora (`[(value)]`, CVA) ou opções que chegam depois: o texto acompanha a escolha, salvo enquanto o usuário digita.
    effect(() => {
      const label = this.selectedOption()?.label ?? '';
      untracked(() => {
        if (!this.filtering()) this.query.set(label);
      });
    });
    // O filtro muda a altura do painel: reposiciona (e desvira) depois de renderizar a nova lista.
    afterRenderEffect(() => {
      this.visible();
      this.ref?.updatePosition();
    });
  }

  override writeValue(value: unknown): void {
    this.value.set(value ?? null);
  }

  protected isSelected(option: ShySelectOption): boolean {
    return this.value() !== null && this.compareWith()(option.value, this.value());
  }

  protected optionId(index: number): string {
    return `${this.id()}-opt-${index}`;
  }

  protected open(): void {
    if (this.isOpen() || this.isDisabled()) return;
    const ref = this.overlay.open(this.panel(), {
      layer: 'dropdown',
      modal: false,
      anchor: this.host,
      position: { placement: 'bottom-start', matchWidth: true },
      closeOnOutsideClick: true,
      restoreFocus: false,
      initialFocus: 'none',
    });
    this.ref = ref;
    this.isOpen.set(true);
    const selected = this.visible().findIndex((option) => this.isSelected(option) && !option.disabled);
    this.activeIndex.set(selected >= 0 ? selected : this.edge(1));
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

  /** Volta o texto ao rótulo da opção escolhida e encerra o filtro. */
  private restore(): void {
    this.filtering.set(false);
    this.query.set(this.selectedOption()?.label ?? '');
  }

  protected onInput(text: string): void {
    this.query.set(text);
    this.filtering.set(true);
    if (!text && this.value() !== null) this.commit(null);
    this.open();
    this.activeIndex.set(this.edge(1));
    this.reveal();
  }

  private edge(direction: 1 | -1): number {
    const options = this.visible();
    const order = options.map((_, i) => i);
    if (direction < 0) order.reverse();
    return order.find((i) => !options[i].disabled) ?? -1;
  }

  private move(delta: 1 | -1): number {
    const options = this.visible();
    const n = options.length;
    let index = this.activeIndex();
    for (let step = 0; step < n; step++) {
      index = (index + delta + n) % n;
      if (!options[index].disabled) return index;
    }
    return -1;
  }

  protected choose(index: number): void {
    const option = this.visible()[index];
    if (!option || option.disabled) return;
    this.commit(option.value);
    this.query.set(option.label);
    this.filtering.set(false);
    this.close();
  }

  private commit(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    switch (event.key) {
      case 'ArrowDown':
        if (this.isOpen()) this.activeIndex.set(this.move(1));
        else this.open();
        break;
      case 'ArrowUp':
        if (this.isOpen()) this.activeIndex.set(this.move(-1));
        else return;
        break;
      case 'Enter':
        if (!this.isOpen() || this.activeIndex() < 0) return;
        this.choose(this.activeIndex());
        break;
      case 'Escape':
        if (!this.isOpen()) return;
        this.close();
        this.restore();
        break;
      default:
        return;
    }
    event.preventDefault();
    this.reveal();
  }

  protected onBlur(): void {
    this.close();
    this.restore();
    this.touched();
  }

  /** Clique no ícone: abre ou fecha e devolve o foco ao campo. */
  protected toggle(): void {
    if (this.isDisabled()) return;
    this.input().nativeElement.focus();
    if (this.isOpen()) this.close();
    else this.open();
  }

  private reveal(): void {
    const index = this.activeIndex();
    queueMicrotask(() => document.getElementById(this.optionId(index))?.scrollIntoView?.({ block: 'nearest' }));
  }
}
