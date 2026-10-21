import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Superfície do conteúdo de um popover: fundo, borda, sombra e respiro. O painel do `OverlayService` é transparente,
 * então o conteúdo desenha a própria caixa; use este componente dentro do `<ng-template>` do `shyPopover`.
 */
@Component({
  selector: 'shy-popover',
  template: '<ng-content />',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {}
