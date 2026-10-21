import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, input, model } from '@angular/core';
import { ShyStepperOrientation } from '../../types/stepper/stepper.type';
import { StepComponent } from './step.component';
import { SHY_STEPPER, ShyStepperContext } from './stepper.token';

/**
 * Indicador de progresso em passos: `<shy-stepper [(value)]="step" label="Checkout"><shy-step label="Cart" />…</shy-stepper>`.
 * É uma lista (`<ol>`) com um botão por passo, `aria-current="step"` no atual; não tem painéis: o consumidor mostra o
 * conteúdo conforme `value` (índice 0-based do passo atual). Passos antes do atual contam como concluídos; `error` marca
 * um passo com problema. Em `linear` só dá para voltar (ou ficar): avançar é com `value`, depois de validar o passo.
 */
@Component({
  selector: 'shy-stepper',
  exportAs: 'shyStepper',
  template: '<ol class="list" [attr.aria-label]="label()"><ng-content /></ol>',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SHY_STEPPER, useExisting: StepperComponent }],
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
})
export class StepperComponent implements ShyStepperContext {
  /** Índice (0-based) do passo atual. */
  readonly value = model(0);
  readonly orientation = input<ShyStepperOrientation>('horizontal');
  /** Só permite ir a passos até o atual; passos adiante não recebem clique. */
  readonly linear = input(false, { transform: booleanAttribute });
  /** Nome acessível da lista de passos (`aria-label`). */
  readonly label = input<string>();
  /** Texto escondido lido depois do nome de um passo concluído / com erro. */
  readonly completeLabel = input('Completed');
  readonly errorLabel = input('Error');

  protected readonly steps = contentChildren(StepComponent);
  readonly current = computed(() => Math.min(Math.max(this.value(), 0), Math.max(this.steps().length - 1, 0)));

  indexOf(step: object): number {
    return this.steps().indexOf(step as StepComponent);
  }

  canGo(step: object): boolean {
    return !this.linear() || this.indexOf(step) <= this.current();
  }

  go(step: object): void {
    if (this.canGo(step)) this.value.set(this.indexOf(step));
  }
}
