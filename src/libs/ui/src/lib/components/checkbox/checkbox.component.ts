import { ChangeDetectionStrategy, Component, effect, ElementRef, model, viewChild } from '@angular/core';
import { ToggleBase } from '../toggle/toggle-base';

/**
 * Caixa de seleção sobre `<input type="checkbox">` nativo (oculto só visualmente): Espaço alterna, foco e leitor de tela do navegador.
 * O texto vem do conteúdo projetado (`<shy-checkbox>Aceito os termos</shy-checkbox>`) ou de `label` (`aria-label`).
 *
 * `[(checked)]` ou `ngModel`/`formControl` (CVA com valor booleano). `indeterminate` é só visual e some no primeiro clique;
 * o leitor de tela anuncia "parcialmente marcado". Dentro de `shy-form-field` recebe `aria-describedby`/`aria-invalid`.
 */
@Component({
  selector: 'shy-checkbox',
  exportAs: 'shyCheckbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() && !indeterminate() ? "" : null',
    '[attr.data-indeterminate]': 'indeterminate() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
  },
})
export class CheckboxComponent extends ToggleBase {
  /** Estado misto (ex.: "selecionar tudo" com parte marcada). Volta a `false` no clique. */
  readonly indeterminate = model(false);

  private readonly native = viewChild.required<ElementRef<HTMLInputElement>>('native');

  constructor() {
    super();
    // `indeterminate` só existe como propriedade do elemento (não há atributo).
    effect(() => (this.native().nativeElement.indeterminate = this.indeterminate()));
  }

  protected change(input: HTMLInputElement): void {
    this.indeterminate.set(false);
    this.toggled(input);
  }
}
