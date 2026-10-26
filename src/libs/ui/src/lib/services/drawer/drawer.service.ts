import { inject, Injectable, TemplateRef, Type } from '@angular/core';
import { ShyDrawerConfig } from '../../interfaces/dialog/dialog.interface';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { devicePx, trackDrag } from '../../utils/drag';
import { haptic } from '../../utils/haptics';
import { ShyDrawerSide } from '../../types';

/**
 * Abre painéis laterais modais (`<dialog>` na camada `drawer`). A posição e a superfície vêm de `styles/drawer.css`
 * pela classe `shy-drawer-pane--<side>`; use `<shy-drawer>` no conteúdo para título, corpo e ações.
 * Diferente do Dialog, clicar no fundo fecha o painel (`closeOnOutsideClick: true`), salvo se a config disser o contrário.
 * Com `dragToClose`, arrastar o cabeçalho (ou o handle de `showHandle`) para a borda fecha o painel em toque e caneta.
 */
@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly overlay = inject(OverlayService);

  open<C = unknown, D = unknown, R = unknown>(content: Type<C> | TemplateRef<ShyOverlayContext<D>>, config: ShyDrawerConfig<D> = {}): ShyOverlayRef<R, C> {
    const { side = 'end', paneClass, dragToClose = false, showHandle = false, haptics = false, ...rest } = config;
    const ref = this.overlay.open<C, D, R>(content, {
      closeOnOutsideClick: true,
      ...rest,
      layer: 'drawer',
      modal: true,
      paneClass: ['shy-drawer-pane', `shy-drawer-pane--${side}`, dragToClose && 'shy-drawer-pane--draggable', paneClass].filter(Boolean).join(' '),
    });
    if (showHandle) ref.pane.setAttribute('data-shy-handle', '');
    if (dragToClose) dragToClosePane(ref, side, haptics);
    return ref;
  }
}

/** Fração do tamanho do painel que, ultrapassada, fecha ao soltar. */
const DISTANCE = 0.4;
/** Velocidade (px/ms) que fecha com pouca distância. */
const FLICK = 0.5;

/** O arrasto só começa em `[data-shy-drag-handle]` (cabeçalho e handle): o corpo rola, então não disputa o gesto. */
function dragToClosePane(ref: ShyOverlayRef<any, any>, side: ShyDrawerSide, haptics: boolean): void {
  const pane = ref.pane;
  const axis = side === 'top' || side === 'bottom' ? 'y' : 'x';
  const rtl = pane.ownerDocument.defaultView?.getComputedStyle(pane).direction === 'rtl';
  // Sentido da borda em coordenadas de tela: base e fim (LTR) vão para baixo/direita; topo e início, para cima/esquerda.
  const sign = side === 'bottom' ? 1 : side === 'top' ? -1 : (side === 'end') === !rtl ? 1 : -1;

  trackDrag(pane, {
    axis,
    sign,
    canStart: (event) => event.target instanceof Element && event.target.closest('[data-shy-drag-handle]') !== null,
    onStart: () => pane.setAttribute('data-dragging', ''),
    onMove: (offset) => pane.style.setProperty(`--_drag-${axis}`, devicePx(offset)),
    onEnd: ({ offset, size, velocity, cancelled }) => {
      pane.removeAttribute('data-dragging');
      if (!cancelled && (Math.abs(offset) > size * DISTANCE || velocity > FLICK)) {
        if (haptics) haptic(pane.ownerDocument);
        void ref.close();
      } else pane.style.removeProperty(`--_drag-${axis}`);
    },
  });
}
