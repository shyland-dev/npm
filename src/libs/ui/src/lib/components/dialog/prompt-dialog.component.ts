import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShyConfirmDialogOptions } from '../../interfaces/dialog/dialog.interface';
import { SHY_OVERLAY_DATA, ShyOverlayRef } from '../../overlay/overlay-ref';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog.component';

export interface PromptDialogData extends ShyConfirmDialogOptions {
  /** `alert`: só um botão, sem escolha. */
  kind: 'alert' | 'confirm';
  okLabel?: string;
}

/**
 * Conteúdo de `DialogService.confirm()` e `alert()`. Interno (não exportado): o foco inicial vai para o botão seguro
 * (`autofocus` em Cancelar, ou em OK no alerta), como pede o padrão APG de alertdialog.
 */
@Component({
  selector: 'shy-prompt-dialog',
  imports: [DialogComponent, ButtonComponent],
  template: `
    <shy-dialog size="sm" [heading]="data.title" [dismissible]="false">
      {{ data.message }}
      <div slot="footer">
        @if (data.kind === 'confirm') {
          <button shyButton variant="ghost" intent="neutral" type="button" autofocus (click)="ref.close(false)">{{ data.cancelLabel ?? 'Cancel' }}</button>
          <button shyButton [intent]="data.intent ?? 'primary'" type="button" (click)="ref.close(true)">{{ data.confirmLabel ?? 'Confirm' }}</button>
        } @else {
          <button shyButton type="button" autofocus (click)="ref.close(true)">{{ data.okLabel ?? 'OK' }}</button>
        }
      </div>
    </shy-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptDialogComponent {
  protected readonly ref = inject<ShyOverlayRef<boolean>>(ShyOverlayRef);
  protected readonly data = inject<PromptDialogData>(SHY_OVERLAY_DATA);
}
