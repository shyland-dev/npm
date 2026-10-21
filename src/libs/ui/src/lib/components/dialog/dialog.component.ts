import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShyDialogSize } from '../../types/dialog/dialog.type';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';
import { DialogSurface } from './dialog-surface';

/**
 * Superfície de um diálogo: título, corpo e ações (`slot="footer"`). Use dentro do conteúdo aberto por
 * `DialogService.open()` (o `<dialog>` modal, o foco, o Esc e o scroll lock são do `OverlayService`):
 *
 * ```html
 * <shy-dialog heading="Excluir projeto" size="sm">
 *   Isso não pode ser desfeito.
 *   <div slot="footer"><button shyButton (click)="ref.close(true)">Excluir</button></div>
 * </shy-dialog>
 * ```
 *
 * - O `heading` é o nome acessível do diálogo; sem ele passe `ariaLabel` na abertura.
 * - `size`: `sm`, `md` (padrão), `lg` ou `full` (tela inteira). Em telas estreitas todos cabem na largura disponível.
 * - Usado fora do serviço (sem `ShyOverlayRef`) é só um painel estático: sem `role` nem modalidade.
 */
@Component({
  selector: 'shy-dialog',
  imports: [IconButtonComponent, IconComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class DialogComponent extends DialogSurface {
  readonly size = input<ShyDialogSize>('md');
}
