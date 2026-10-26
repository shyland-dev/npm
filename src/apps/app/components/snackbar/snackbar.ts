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

  protected async undo(): Promise<void> {
    // Padrão para ação reversível: a ação já foi feita; o toast só dá a chance de desfazer.
    const result = await this.snackbar.undo('Item deleted');
    this.last.set(result === 'undo' ? 'undone: item restored' : 'committed: item stays deleted');
  }

  protected readonly items = signal(['Invoice 101', 'Invoice 102', 'Invoice 103']);

  /** Feedback otimista: o item some na hora; `undo()` o devolve; só no `commit` a "API" é chamada. */
  protected async removeOptimistic(item: string): Promise<void> {
    const before = this.items();
    this.items.set(before.filter((i) => i !== item));
    if ((await this.snackbar.undo(`${item} deleted`)) === 'undo') {
      this.items.set(before);
      this.last.set(`${item}: restored, API never called`);
    } else {
      this.last.set(`${item}: committed, API called now`);
    }
  }

  protected async promise(fail: boolean): Promise<void> {
    const work = new Promise<number>((resolve, reject) => setTimeout(() => (fail ? reject(new Error('offline')) : resolve(3)), 1800));
    try {
      await this.snackbar.promise(work, { loading: 'Saving changes...', success: (n) => `${n} changes saved`, error: (e) => `Could not save: ${(e as Error).message}` });
    } catch {
      // O erro já virou um toast danger; a Promise continua rejeitando para quem precisa tratar.
    }
  }

  protected updateById(): void {
    // Mesmo id: o toast aberto é atualizado em vez de empilhar outro.
    this.snackbar.show(`Upload: ${++this.uploads} file(s)`, { id: 'upload', duration: 6000 });
  }

  private uploads = 0;

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
