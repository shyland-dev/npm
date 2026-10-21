import { Directive, input, TemplateRef, Type } from '@angular/core';
import { ShyOverlayConfig, ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { OverlayTrigger } from '../../overlay/overlay-trigger';
import { ShyPlacement } from '../../types/overlay/overlay.type';

/**
 * Painel não modal junto ao elemento: `<button [shyPopover]="tpl">` com `<ng-template #tpl><shy-popover>…</shy-popover></ng-template>`
 * (ou um componente). O gatilho ganha `aria-expanded`, `aria-controls` e `aria-haspopup="dialog"`.
 *
 * - Abre com o foco no primeiro focável (ou no painel, se não houver). Esc, clique fora e novo clique no gatilho fecham e devolvem o foco ao gatilho.
 * - O Tab que sai do primeiro ou do último focável fecha o painel e segue pela página a partir do gatilho.
 * - Controle por código: `exportAs: 'shyPopover'` (`open()`, `close()`, `toggle()`, `expanded`).
 */
@Directive({
  selector: '[shyPopover]',
  exportAs: 'shyPopover',
  host: { 'aria-haspopup': 'dialog' },
})
export class PopoverDirective extends OverlayTrigger {
  /** Conteúdo: um `TemplateRef` (com `<shy-popover>`) ou um componente. */
  readonly shyPopover = input.required<TemplateRef<ShyOverlayContext> | Type<unknown>>();
  readonly shyPopoverPlacement = input<ShyPlacement>('bottom-start');
  /** Dados para o conteúdo (`SHY_OVERLAY_DATA` ou `$implicit` no template). */
  readonly shyPopoverData = input<unknown>();

  protected content() {
    return this.shyPopover();
  }

  protected overlayConfig(): ShyOverlayConfig {
    return {
      layer: 'popover',
      modal: false,
      position: { placement: this.shyPopoverPlacement() },
      closeOnOutsideClick: true,
      initialFocus: 'first',
      data: this.shyPopoverData(),
    };
  }
}
