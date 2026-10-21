import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, DialogService, FormFieldComponent, InputComponent, PopoverComponent, PopoverDirective, ShyPlacement } from '@shyland-dev/ui';
import { OverlaysInDialog } from './overlays-in-dialog';

@Component({
  selector: 'app-popover-page',
  imports: [ButtonComponent, FormFieldComponent, InputComponent, PopoverComponent, PopoverDirective],
  templateUrl: './popover.html',
})
export class PopoverPage {
  private readonly dialogs = inject(DialogService);

  protected readonly placements: ShyPlacement[] = ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end', 'start', 'end'];
  protected readonly saved = signal('');
  protected readonly draft = signal('Shyland UI');

  protected openDialog(): void {
    this.dialogs.open(OverlaysInDialog);
  }
}
