import { Component } from '@angular/core';
import { ButtonComponent, IconButtonComponent, IconComponent, ShyPlacement, TooltipDirective } from '@shyland-dev/ui';

@Component({
  selector: 'app-tooltip-page',
  imports: [ButtonComponent, IconButtonComponent, IconComponent, TooltipDirective],
  templateUrl: './tooltip.html',
})
export class TooltipPage {
  protected readonly placements: ShyPlacement[] = ['top', 'bottom', 'start', 'end'];
}
