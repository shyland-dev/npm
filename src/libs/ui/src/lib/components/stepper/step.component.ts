import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SHY_STEPPER } from './stepper.token';

/**
 * Um passo de `shy-stepper`: `label` (e `description` opcional) viram o botão. O estado vem da posição em relação ao
 * passo atual; `error` e `disabled` são do consumidor. Conteúdo projetado (opcional) aparece ao lado do texto, ex. um badge.
 */
@Component({
  selector: 'shy-step',
  exportAs: 'shyStep',
  imports: [IconComponent],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[attr.data-status]': 'status()',
  },
})
export class StepComponent {
  protected readonly stepper = inject(SHY_STEPPER);

  readonly label = input.required<string>();
  readonly description = input<string>();
  readonly error = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly index = computed(() => this.stepper.indexOf(this));
  protected readonly status = computed(() => {
    const index = this.index();
    const current = this.stepper.current();
    if (this.error()) return 'error';
    if (index < current) return 'complete';
    return index === current ? 'current' : 'upcoming';
  });
  protected readonly reachable = computed(() => this.stepper.canGo(this));
}
