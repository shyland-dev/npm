import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShyProgressSize } from '../../types/progress/progress.type';
import { PROGRESS_HOST, ProgressBase } from './progress-value';

/**
 * Barra de progresso linear (`role="progressbar"`). Sem `value` fica indeterminada (sem `aria-valuenow`).
 * Com reduced motion o indeterminado vira uma barra cheia que pulsa.
 */
@Component({
  selector: 'shy-progress',
  template: '<span class="bar" [class.is-indeterminate]="indeterminate()"></span>',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ...PROGRESS_HOST, '[attr.data-size]': 'size()' },
})
export class ProgressComponent extends ProgressBase {
  readonly size = input<ShyProgressSize>('md');
}
