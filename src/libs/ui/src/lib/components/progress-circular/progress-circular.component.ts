import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShySpinnerSize } from '../../types/spinner/spinner.type';
import { PROGRESS_HOST, ProgressBase } from '../progress/progress-value';

/**
 * Progresso circular (`role="progressbar"`). Sem `value` fica indeterminado.
 * Com reduced motion o indeterminado para de girar e pulsa.
 */
@Component({
  selector: 'shy-progress-circular',
  templateUrl: './progress-circular.component.html',
  styleUrl: './progress-circular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ...PROGRESS_HOST, '[attr.data-size]': 'size()' },
})
export class ProgressCircularComponent extends ProgressBase {
  readonly size = input<ShySpinnerSize>('md');
}
