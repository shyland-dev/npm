import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { ShyDrawerConfig } from '../../interfaces/dialog/dialog.interface';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';

/**
 * Abre painéis laterais modais (`<dialog>` na camada `drawer`). A posição e a superfície vêm de `styles/drawer.css`
 * pela classe `shy-drawer-pane--<side>`; use `<shy-drawer>` no conteúdo para título, corpo e ações.
 * Diferente do Dialog, clicar no fundo fecha o painel (`closeOnOutsideClick: true`), salvo se a config disser o contrário.
 */
@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly overlay = inject(OverlayService);

  open<C = unknown, D = unknown, R = unknown>(content: Type<C> | TemplateRef<ShyOverlayContext<D>>, config: ShyDrawerConfig<D> = {}): ShyOverlayRef<R, C> {
    const { side = 'end', paneClass, ...rest } = config;
    return this.overlay.open<C, D, R>(content, {
      closeOnOutsideClick: true,
      ...rest,
      layer: 'drawer',
      modal: true,
      paneClass: ['shy-drawer-pane', `shy-drawer-pane--${side}`, paneClass].filter(Boolean).join(' '),
    });
  }
}
