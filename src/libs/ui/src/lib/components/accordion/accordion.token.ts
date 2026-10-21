import { InjectionToken, Signal } from '@angular/core';

/** O que o `shy-accordion-item` precisa dos outros itens e do que o `shy-accordion` oferece. */
export interface ShyAccordionPanel {
  readonly open: { set(value: boolean): void };
}

export interface ShyAccordionContext {
  readonly multiple: Signal<boolean>;
  register(item: ShyAccordionPanel): () => void;
  /** Avisa que o item abriu: sem `multiple`, os outros fecham. */
  opened(item: ShyAccordionPanel): void;
}

export const SHY_ACCORDION = new InjectionToken<ShyAccordionContext>('SHY_ACCORDION');
