import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { SHY_ACCORDION, ShyAccordionContext, ShyAccordionPanel } from './accordion.token';

/**
 * Grupo de `shy-accordion-item`. Por padrão só um item fica aberto; `multiple` permite vários.
 * Teclado (APG Accordion, opcional): com o foco num cabeçalho, ↓/↑ vão ao próximo/anterior (sem dar a volta) e Home/End às pontas.
 * Em modo único, o fechamento dos outros acontece quando o usuário abre um item; `[open]` definido por código não fecha os demais.
 */
@Component({
  selector: 'shy-accordion',
  exportAs: 'shyAccordion',
  template: '<ng-content />',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SHY_ACCORDION, useExisting: AccordionComponent }],
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class AccordionComponent implements ShyAccordionContext {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly items = new Set<ShyAccordionPanel>();

  /** Permite vários itens abertos ao mesmo tempo. */
  readonly multiple = input(false, { transform: booleanAttribute });

  register(item: ShyAccordionPanel): () => void {
    this.items.add(item);
    return () => this.items.delete(item);
  }

  opened(item: ShyAccordionPanel): void {
    if (this.multiple()) return;
    for (const other of this.items) if (other !== item) other.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('trigger') || target.closest('shy-accordion') !== this.el) return;

    const triggers = Array.from(this.el.querySelectorAll<HTMLButtonElement>('.trigger:not(:disabled)')).filter((t) => t.closest('shy-accordion') === this.el);
    const current = triggers.indexOf(target as HTMLButtonElement);
    let next: number;
    if (event.key === 'ArrowDown') next = Math.min(current + 1, triggers.length - 1);
    else if (event.key === 'ArrowUp') next = Math.max(current - 1, 0);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = triggers.length - 1;
    else return;

    event.preventDefault();
    triggers[next]?.focus();
  }
}
