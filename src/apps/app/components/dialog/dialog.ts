import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, DialogService, ShyDialogSize } from '@shyland-dev/ui';
import { DemoDialog } from './dialog-demo';

@Component({
  selector: 'app-dialog-page',
  imports: [ButtonComponent],
  templateUrl: './dialog.html',
})
export class DialogPage {
  private readonly dialogs = inject(DialogService);

  protected readonly sizes: ShyDialogSize[] = ['sm', 'md', 'lg', 'full'];
  protected readonly result = signal('nothing yet');

  protected async open(size: ShyDialogSize): Promise<void> {
    const ref = this.dialogs.open<DemoDialog, { size: ShyDialogSize }, string>(DemoDialog, { data: { size } });
    const name = await ref.closed;
    this.result.set(name === undefined ? 'closed without saving' : `saved "${name}"`);
  }

  protected async confirm(): Promise<void> {
    const ok = await this.dialogs.confirm({ title: 'Delete project?', message: 'This removes the project and its files. It cannot be undone.', confirmLabel: 'Delete', intent: 'danger' });
    this.result.set(ok ? 'confirmed' : 'cancelled');
  }

  protected async alert(): Promise<void> {
    await this.dialogs.alert({ title: 'Saved', message: 'Your changes were saved.' });
    this.result.set('alert closed');
  }
}
