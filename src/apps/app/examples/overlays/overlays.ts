import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, DialogComponent, DialogService, DividerComponent, FormFieldComponent, IconButtonComponent, IconComponent, InputComponent, MenuComponent, MenuDirective, MenuItemComponent, PopoverComponent, PopoverDirective, SelectComponent, ShyOverlayRef, ShySelectOption, SnackbarService, TooltipDirective } from '@shyland-dev/ui';

/** Dialog com formulário: Select (painel dentro do <dialog>), Tooltip e toast ao salvar com o modal aberto. */
@Component({
  selector: 'app-project-dialog',
  imports: [DialogComponent, ButtonComponent, FormFieldComponent, InputComponent, SelectComponent, IconButtonComponent, IconComponent, TooltipDirective, FormsModule],
  template: `
    <shy-dialog heading="New project" closeLabel="Close dialog">
      <shy-form-field label="Name" hint="Shown in the sidebar.">
        <input shyInput [(ngModel)]="name" />
      </shy-form-field>
      <shy-form-field label="Visibility">
        <shy-select [options]="visibility" [(ngModel)]="level" placeholder="Choose" />
      </shy-form-field>
      <div slot="footer">
        <button shyIconButton type="button" label="Help" shyTooltip="Names can be changed later"><shy-icon>info-circle</shy-icon></button>
        <button shyButton variant="ghost" intent="neutral" type="button" (click)="ref.close()">Cancel</button>
        <button shyButton type="button" (click)="save()">Save</button>
      </div>
    </shy-dialog>
  `,
})
export class ProjectDialog {
  protected readonly ref = inject(ShyOverlayRef);
  private readonly snackbar = inject(SnackbarService);

  protected readonly visibility: ShySelectOption[] = [
    { value: 'private', label: 'Private' },
    { value: 'team', label: 'Team' },
    { value: 'public', label: 'Public (unavailable)', disabled: true },
  ];
  protected name = 'Shyland UI';
  protected level: string | null = 'private';

  protected save(): void {
    // O modal ainda está aberto: o toast mostra só o texto (a ação ficaria inerte).
    this.snackbar.show(`Saved "${this.name}"`, { intent: 'success', action: { label: 'Undo' } });
    void this.ref.close(this.name);
  }
}

@Component({
  selector: 'app-overlays-example',
  imports: [ButtonComponent, DividerComponent, IconButtonComponent, IconComponent, MenuComponent, MenuDirective, MenuItemComponent, PopoverComponent, PopoverDirective, TooltipDirective],
  templateUrl: './overlays.html',
})
export class OverlaysExample {
  private readonly dialogs = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);

  protected readonly last = signal('nothing yet');

  protected async newProject(): Promise<void> {
    const name = await this.dialogs.open<ProjectDialog, void, string>(ProjectDialog).closed;
    this.last.set(name ? `created "${name}"` : 'cancelled');
  }

  protected async remove(): Promise<void> {
    if (!(await this.dialogs.confirm({ title: 'Delete project?', message: 'This cannot be undone.', confirmLabel: 'Delete', intent: 'danger' }))) return;
    const ref = this.snackbar.show('Project deleted', { intent: 'danger', action: { label: 'Undo' } });
    this.last.set(`deleted; toast closed by: ${await ref.closed}`);
  }
}
