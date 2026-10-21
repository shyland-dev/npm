import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShyDividerOrientation } from '../../types/divider/divider.type';

/**
 * Separador: `role="separator"` com `aria-orientation` (o horizontal é o padrão do papel, então só o vertical o declara).
 * O texto opcional (`<shy-divider>ou</shy-divider>`, só no horizontal) é visual: não coloque nele informação essencial.
 * No vertical, dê ao pai altura definida ou use `align-self: stretch` num flex.
 */
@Component({
  selector: 'shy-divider',
  template: '<span class="line"></span><span class="text"><ng-content /></span><span class="line"></span>',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': 'orientation() === "vertical" ? "vertical" : null',
    '[attr.data-orientation]': 'orientation()',
  },
})
export class DividerComponent {
  readonly orientation = input<ShyDividerOrientation>('horizontal');
}
