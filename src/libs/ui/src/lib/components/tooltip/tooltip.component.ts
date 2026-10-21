import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHY_OVERLAY_DATA } from '../../overlay/overlay-ref';

/** Conteúdo do painel do `shyTooltip` (interno): só o texto, em `role="tooltip"` no painel. */
@Component({
  selector: 'shy-tooltip',
  template: '{{ text }}',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  protected readonly text = inject<string>(SHY_OVERLAY_DATA);
}
