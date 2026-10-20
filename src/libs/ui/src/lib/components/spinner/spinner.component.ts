import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShySpinnerSize, ShySpinnerVariant } from '../../types/spinner/spinner.type';

/**
 * Indicador de atividade sem duração conhecida. A cor vem de `currentColor`.
 *
 * Com `label` vira `role="status"` e o texto fica só para leitor de tela; sem `label` é decorativo (`aria-hidden`),
 * para uso dentro de algo que já anuncia o estado (ex.: botão com `aria-busy`).
 * Com reduced motion toda variante para de se mover e só pulsa a opacidade.
 */
@Component({
  selector: 'shy-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'label() ? "status" : null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
})
export class SpinnerComponent {
  readonly variant = input<ShySpinnerVariant>('ring');
  readonly size = input<ShySpinnerSize>('md');
  /** Texto anunciado (ex.: "Carregando pedidos"). Sem ele o spinner é decorativo. */
  readonly label = input<string>();
}
