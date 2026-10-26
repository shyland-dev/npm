import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { PromptDialogComponent } from '../../components/dialog/prompt-dialog.component';
import { ShyAlertDialogOptions, ShyConfirmDialogOptions, ShyDialogConfig } from '../../interfaces/dialog/dialog.interface';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';

/**
 * Abre diálogos modais (`<dialog>` nativo pelo `OverlayService`): `open()` para conteúdo próprio (use `<shy-dialog>` dentro dele),
 * `confirm()` e `alert()` prontos (`role="alertdialog"`, foco no botão seguro, sem fechar por clique fora).
 * `closeOnOutsideClick` e `closeOnEscape` seguem o padrão do overlay modal; o resto da config é a de `OverlayService.open`.
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly overlay = inject(OverlayService);

  open<C = unknown, D = unknown, R = unknown>(content: Type<C> | TemplateRef<ShyOverlayContext<D>>, config: ShyDialogConfig<D> = {}): ShyOverlayRef<R, C> {
    const { presentation = 'center', paneClass, ...rest } = config;
    return this.overlay.open<C, D, R>(content, {
      ...rest,
      layer: 'modal',
      modal: true,
      paneClass: [paneClass, presentation !== 'center' && `shy-dialog-pane--${presentation}`].filter(Boolean).join(' ') || undefined,
    });
  }

  /** Resolve `true` ao confirmar; `false` ao cancelar ou fechar com Esc. */
  async confirm(options: ShyConfirmDialogOptions): Promise<boolean> {
    const ref = this.overlay.open<PromptDialogComponent, unknown, boolean>(PromptDialogComponent, {
      layer: 'modal',
      modal: true,
      role: 'alertdialog',
      closeOnOutsideClick: false,
      data: { ...options, kind: 'confirm' },
    });
    return (await ref.closed) === true;
  }

  /** Resolve quando a pessoa fecha (OK ou Esc). */
  async alert(options: ShyAlertDialogOptions): Promise<void> {
    const ref = this.overlay.open<PromptDialogComponent, unknown, boolean>(PromptDialogComponent, {
      layer: 'modal',
      modal: true,
      role: 'alertdialog',
      closeOnOutsideClick: false,
      data: { title: options.title, message: options.message, okLabel: options.okLabel, kind: 'alert' },
    });
    await ref.closed;
  }
}
