import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { ShySkeletonAnimation, ShySkeletonShape } from '../../types/skeleton/skeleton.type';

/**
 * Placeholder de conteúdo em carregamento. Decorativo (`aria-hidden`): quem anuncia o carregamento é a região
 * que o contém, com `aria-busy="true"` (e o conteúdo real ou um `shy-spinner` com `label`).
 * Com reduced motion o brilho vira pulso de opacidade.
 */
@Component({
  selector: 'shy-skeleton',
  template: `
    @if (shape() === 'text') {
      @for (line of lineList(); track $index) {
        <span class="bone line"></span>
      }
    } @else {
      <span class="bone"></span>
    }
  `,
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[attr.data-shape]': 'shape()',
    '[attr.data-animation]': 'animation()',
  },
})
export class SkeletonComponent {
  readonly shape = input<ShySkeletonShape>('text');
  /** Linhas do `shape="text"` (a última fica mais curta quando há mais de uma). */
  readonly lines = input(1, { transform: (v: unknown) => Math.max(1, Math.floor(numberAttribute(v, 1))) });
  readonly animation = input<ShySkeletonAnimation>('shimmer');

  protected readonly lineList = computed(() => Array.from({ length: this.lines() }));
}
