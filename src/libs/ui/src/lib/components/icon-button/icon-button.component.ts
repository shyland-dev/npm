import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShyButtonSize, ShyIconButtonVariant } from '../../types/button/button.type';
import { ShyIntent } from '../../types/intent/intent.type';

/**
 * Botão só com ícone: `<button shyIconButton label="Fechar"><shy-icon>x-lg</shy-icon></button>`.
 * `label` é obrigatório e vira o `aria-label` (o ícone projetado fica decorativo).
 * Quadrado com o lado de `--shy-size-control-*`, que cresce em ponteiro grosso (alvo ≥ 44 px no celular).
 */
@Component({
  selector: 'button[shyIconButton]',
  exportAs: 'shyIconButton',
  template: '<ng-content />',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': 'label()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-intent]': 'intent()',
    '[attr.data-size]': 'size()',
  },
})
export class IconButtonComponent {
  /** Nome acessível (obrigatório). */
  readonly label = input.required<string>();
  readonly variant = input<ShyIconButtonVariant>('ghost');
  readonly intent = input<ShyIntent>('neutral');
  readonly size = input<ShyButtonSize>('md');
}
