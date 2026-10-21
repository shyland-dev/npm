import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model, numberAttribute } from '@angular/core';
import { ControlBase } from '../toggle/control-base';

/**
 * Controle deslizante de valor único sobre `<input type="range">` nativo: teclado (setas, Page Up/Down, Home/End), `role="slider"`
 * e `aria-valuenow/min/max` vêm do navegador. Valor: `[(value)]`, `ngModel` ou `formControl`.
 *
 * - `min`, `max` e `step` (padrões 0, 100 e 1); o valor é sempre limitado a esse intervalo pelo nativo.
 * - `displayWith` formata o valor para o leitor de tela (`aria-valuetext`) e para o texto visível (`showValue`).
 * - Faixa com dois thumbs não faz parte da v1: use dois sliders.
 */
@Component({
  selector: 'shy-slider',
  exportAs: 'shySlider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
    '[style.--_pct]': 'percent()',
  },
})
export class SliderComponent extends ControlBase<number> {
  readonly value = model(0);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  /** Formata o valor para `aria-valuetext` e para o texto de `showValue`. */
  readonly displayWith = input<(value: number) => string>();
  /** Mostra o valor ao lado do controle. */
  readonly showValue = input(false, { transform: booleanAttribute });

  protected readonly text = computed(() => this.displayWith()?.(this.value()) ?? String(this.value()));
  protected readonly percent = computed(() => {
    const span = this.max() - this.min();
    return span > 0 ? Math.min(100, Math.max(0, ((this.value() - this.min()) / span) * 100)) : 0;
  });

  override writeValue(value: unknown): void {
    const n = Number(value);
    this.value.set(value === null || value === undefined || Number.isNaN(n) ? this.min() : n);
  }

  protected changed(input: HTMLInputElement): void {
    const value = input.valueAsNumber;
    this.value.set(value);
    this.onChange(value);
  }
}
