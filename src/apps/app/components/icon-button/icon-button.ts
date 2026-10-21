import { Component } from '@angular/core';
import { IconButtonComponent, IconComponent, ShyIconButtonVariant, ShyIntent } from '@shyland-dev/ui';

@Component({
  selector: 'app-icon-button-page',
  imports: [IconButtonComponent, IconComponent],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButtonPage {
  protected readonly variants: ShyIconButtonVariant[] = ['solid', 'soft', 'outline', 'ghost'];
  protected readonly intents: ShyIntent[] = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'];
  protected readonly states = ['hover', 'focus', 'active'];
}
