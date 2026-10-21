import { booleanAttribute, ChangeDetectionStrategy, Component, DestroyRef, inject, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SHY_ACCORDION } from './accordion.token';

let nextId = 0;

/**
 * Item do `shy-accordion`: cabeçalho (`role="heading"` com um `<button aria-expanded aria-controls>`) e painel `role="region"`.
 * Fechado, o painel fica `inert` (fora do Tab e dos leitores de tela). `[(open)]` controla o estado.
 * `level` é o `aria-level` do cabeçalho; ajuste conforme a hierarquia da página.
 */
@Component({
  selector: 'shy-accordion-item',
  exportAs: 'shyAccordionItem',
  imports: [IconComponent],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AccordionItemComponent {
  private readonly accordion = inject(SHY_ACCORDION, { optional: true });
  private readonly uid = nextId++;

  readonly label = input.required<string>();
  readonly open = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  /** `aria-level` do cabeçalho. */
  readonly level = input(3);

  protected readonly triggerId = `shy-accordion-trigger-${this.uid}`;
  protected readonly panelId = `shy-accordion-panel-${this.uid}`;

  constructor() {
    if (this.accordion) inject(DestroyRef).onDestroy(this.accordion.register(this));
  }

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    if (next) this.accordion?.opened(this);
  }
}
