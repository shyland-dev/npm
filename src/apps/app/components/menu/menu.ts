import { Component, signal } from '@angular/core';
import { ButtonComponent, DividerComponent, IconComponent, MenuComponent, MenuDirective, MenuItemComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-menu-page',
  imports: [ButtonComponent, DividerComponent, IconComponent, MenuComponent, MenuDirective, MenuItemComponent],
  templateUrl: './menu.html',
})
export class MenuPage {
  protected readonly last = signal('nothing yet');
}
