import { InjectionToken, Signal } from '@angular/core';

/** O que o `shy-stepper` oferece aos `shy-step` filhos. */
export interface ShyStepperContext {
  /** Índice do passo atual (0-based), já limitado ao intervalo dos passos. */
  readonly current: Signal<number>;
  /** Posição do passo entre os filhos (comparado por identidade), ou -1 se ele não está no stepper. */
  indexOf(step: object): number;
  /** Se o passo pode receber foco/clique agora (respeita `linear`). */
  canGo(step: object): boolean;
  go(step: object): void;
  readonly completeLabel: Signal<string>;
  readonly errorLabel: Signal<string>;
}

export const SHY_STEPPER = new InjectionToken<ShyStepperContext>('SHY_STEPPER');
