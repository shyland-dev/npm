import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, DrawerService, ShyDrawerSide } from '@shyland-dev/ui';
import { DemoDrawer } from './drawer-demo';

@Component({
  selector: 'app-drawer-page',
  imports: [ButtonComponent],
  templateUrl: './drawer.html',
})
export class DrawerPage {
  private readonly drawers = inject(DrawerService);

  protected readonly sides: ShyDrawerSide[] = ['start', 'end', 'top', 'bottom'];
  protected readonly result = signal('nothing yet');

  protected async open(side: ShyDrawerSide, touch = false): Promise<void> {
    const ref = this.drawers.open<DemoDrawer, ShyDrawerSide, boolean>(DemoDrawer, { side, data: side, dragToClose: touch, showHandle: touch && side === 'bottom' });
    this.result.set((await ref.closed) ? `applied (${side})` : `dismissed (${side})`);
  }
}
