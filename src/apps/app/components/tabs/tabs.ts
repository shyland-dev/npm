import { Component, signal } from '@angular/core';
import { TabComponent, TabsComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-tabs-page',
  imports: [TabsComponent, TabComponent],
  templateUrl: './tabs.html',
})
export class TabsPage {
  protected readonly tab = signal<string>('profile');
}
