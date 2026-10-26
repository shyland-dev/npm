import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { devicePx, trackDrag } from '../../utils/drag';

/** Fração da largura que, ultrapassada, fecha o toast ao soltar. */
const DISTANCE = 0.4;
/** Velocidade (px/ms) que fecha o toast mesmo com pouca distância (um "flick"). */
const FLICK = 0.5;

/**
 * Arrastar para o lado fecha o toast (interno do outlet do Snackbar). Só toque e caneta; o botão de fechar continua sendo a
 * alternativa sem gesto (WCAG 2.5.1 e 2.5.7). Qualquer sentido fecha, então vale também em RTL. O toast acompanha o dedo por
 * `--_swipe-x`/`--_swipe-p` (lidas pelo CSS do outlet); o CSS precisa de `touch-action: pan-y` para o scroll vertical seguir nativo.
 */
@Directive({
  selector: '[shySwipeDismiss]',
  host: { '[attr.data-swipe]': 'enabled() ? "" : null' },
})
export class SwipeDismissDirective {
  readonly enabled = input(true, { alias: 'shySwipeDismiss' });
  /** `true` ao começar o arrasto e `false` ao terminar (o timer do toast pausa enquanto isso). */
  readonly dragging = output<boolean>();
  readonly swiped = output<void>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      const el = this.el;
      const stop = trackDrag(el, {
        axis: 'x',
        sign: 0,
        onStart: () => {
          el.setAttribute('data-swiping', '');
          this.dragging.emit(true);
        },
        onMove: (offset) => {
          el.style.setProperty('--_swipe-x', devicePx(offset));
          el.style.setProperty('--_swipe-p', String(Math.min(1, Math.abs(offset) / (el.offsetWidth || 1))));
        },
        onEnd: ({ offset, size, velocity, cancelled }) => {
          el.removeAttribute('data-swiping');
          const away = !cancelled && (Math.abs(offset) > size * DISTANCE || velocity > FLICK);
          if (away) {
            el.setAttribute('data-swiped', '');
            el.style.setProperty('--_swipe-x', devicePx(Math.sign(offset) * size * 1.1));
            this.swiped.emit();
          } else {
            el.style.removeProperty('--_swipe-x');
            el.style.removeProperty('--_swipe-p');
          }
          this.dragging.emit(false);
        },
      });
      onCleanup(stop);
    });
  }
}
