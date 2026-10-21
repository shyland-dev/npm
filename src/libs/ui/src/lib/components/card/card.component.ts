import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { ShyCardElevation } from '../../types/card/card.type';

/**
 * Contêiner de conteúdo com slots: `slot="header"`, corpo (conteúdo padrão) e `slot="footer"`.
 *
 * `<shy-card>` não é interativo. Para um cartão clicável use o próprio elemento nativo,
 * `<a shyCard href>` ou `<button shyCard>`: ele ganha foco visível, hover (só com `@media (hover: hover)`) e estado pressionado.
 * Um cartão interativo não deve conter outros controles (links/botões aninhados são inválidos); nesse caso use `shy-card`.
 */
@Component({
  selector: 'shy-card, a[shyCard], button[shyCard]',
  exportAs: 'shyCard',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-elevation]': 'elevation()',
    '[attr.data-interactive]': 'interactive ? "" : null',
  },
})
export class CardComponent {
  readonly elevation = input<ShyCardElevation>(1);

  protected readonly interactive = ['A', 'BUTTON'].includes((inject(ElementRef).nativeElement as HTMLElement).tagName);
}
