import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleBase } from '../toggle/toggle-base';

/**
 * Interruptor liga/desliga sobre `<input type="checkbox" role="switch">` nativo: Espaço alterna e o leitor de tela anuncia
 * "ligado/desligado" pelo estado nativo (sem `aria-checked` redundante). Mesma API do Checkbox (`[(checked)]`, CVA, `label`).
 * A posição do botão indica o estado, não só a cor.
 */
@Component({
  selector: 'shy-switch',
  exportAs: 'shySwitch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
  },
})
export class SwitchComponent extends ToggleBase {}
