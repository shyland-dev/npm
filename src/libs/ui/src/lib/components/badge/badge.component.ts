import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ShyBadgeSize, ShyBadgeVariant } from '../../types/badge/badge.type';
import { ShyIntent } from '../../types/intent/intent.type';
import { IconComponent } from '../icon/icon.component';

/**
 * Etiqueta curta de estado ou categoria: `<shy-badge intent="success">Pago</shy-badge>`.
 *
 * - `count` mostra um número (`max` limita: `99+`); `dot` acrescenta um ponto antes do texto.
 * - Só com ponto ou sem texto, dê `label` (vira `role="img"` + `aria-label`); com texto o ponto é decorativo.
 * - `removable` acrescenta um botão (`removeLabel` = nome acessível) que emite `removed`; quem usa remove o item.
 * O significado nunca depende só da cor: o texto (ou `label`) diz o estado.
 */
@Component({
  selector: 'shy-badge',
  imports: [IconComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-intent]': 'intent()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() ?? null',
  },
})
export class BadgeComponent {
  readonly intent = input<ShyIntent>('neutral');
  readonly variant = input<ShyBadgeVariant>('soft');
  readonly size = input<ShyBadgeSize>('md');
  /** Ponto colorido antes do texto (decorativo). */
  readonly dot = input(false, { transform: booleanAttribute });
  /** Número exibido no lugar do texto projetado. */
  readonly count = input<number | undefined>(undefined);
  /** Acima disso o contador mostra `max+`. */
  readonly max = input(99);
  /** Nome acessível quando o badge não tem texto (só ponto) ou para sobrescrever o texto. */
  readonly label = input<string>();
  readonly removable = input(false, { transform: booleanAttribute });
  /** Nome acessível do botão de remover. */
  readonly removeLabel = input('Remove');
  readonly removed = output<void>();

  protected readonly countText = computed(() => {
    const count = this.count();
    return count === undefined ? null : count > this.max() ? `${this.max()}+` : `${count}`;
  });
}
