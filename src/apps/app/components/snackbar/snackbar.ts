import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, DialogService, ShySnackbarAlign, ShySnackbarIntent, SnackbarPosition, SnackbarService } from '@shyland-dev/ui';

@Component({
  selector: 'app-snackbar-page',
  imports: [ButtonComponent],
  templateUrl: './snackbar.html',
})
export class SnackbarPage {
  private readonly snackbar = inject(SnackbarService);
  private readonly dialogs = inject(DialogService);

  protected readonly intents: ShySnackbarIntent[] = ['neutral', 'info', 'success', 'warning', 'danger'];
  protected readonly positions: SnackbarPosition[] = ['top', 'bottom'];
  protected readonly aligns: ShySnackbarAlign[] = ['start', 'center', 'end'];
  protected readonly last = signal('nothing yet');

  protected show(intent: ShySnackbarIntent, position: SnackbarPosition = 'bottom', align: ShySnackbarAlign = 'center'): void {
    this.snackbar.show(`This is a ${intent} message (${position}, ${align})`, { intent, position, align });
  }

  protected async withAction(): Promise<void> {
    const ref = this.snackbar.show('Item deleted', { action: { label: 'Undo' } });
    this.last.set(`closed by: ${await ref.closed}`);
  }

  protected burst(): void {
    for (let i = 1; i <= 6; i++) this.snackbar.show(`Queued toast ${i} (3 at a time)`, { duration: 4000 });
  }

  protected persistent(): void {
    this.snackbar.show('Stays until dismissed (the X button)', { duration: 0, intent: 'warning' });
  }

  protected async openDialog(): Promise<void> {
    const ref = this.dialogs.alert({ title: 'Toast over a modal', message: 'A toast with an action opens while this dialog is open: the action button is hidden (the toast is inert behind the modal).' });
    setTimeout(() => this.snackbar.show('Saved in the background', { action: { label: 'Undo' }, duration: 10000 }), 300);
    await ref;
  }
}
