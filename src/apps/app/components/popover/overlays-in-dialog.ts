import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, DialogComponent, DividerComponent, IconButtonComponent, IconComponent, MenuComponent, MenuDirective, MenuItemComponent, PopoverComponent, PopoverDirective, TooltipDirective } from '@shyland-dev/ui';

/** Popover, menu e tooltip dentro de um Dialog modal: os painéis ancorados moram dentro do <dialog> (ADR-F4-5), então continuam clicáveis. */
@Component({
  selector: 'app-overlays-in-dialog',
  imports: [DialogComponent, ButtonComponent, DividerComponent, IconButtonComponent, IconComponent, MenuComponent, MenuDirective, MenuItemComponent, PopoverComponent, PopoverDirective, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <shy-dialog heading="Overlays inside a dialog" closeLabel="Close dialog">
      <div class="shy-cluster">
        <button shyButton variant="outline" type="button" [shyPopover]="pop">Popover</button>
        <button shyButton variant="outline" type="button" [shyMenu]="menu">Menu</button>
        <button shyIconButton type="button" label="Settings" shyTooltip="Settings"><shy-icon>gear</shy-icon></button>
      </div>
      <ng-template #pop><shy-popover>Still clickable above the modal backdrop.</shy-popover></ng-template>
      <ng-template #menu>
        <shy-menu>
          <button shyMenuItem type="button">Edit</button>
          <button shyMenuItem type="button">Copy</button>
          <shy-divider />
          <button shyMenuItem type="button" disabled>Archive</button>
        </shy-menu>
      </ng-template>
    </shy-dialog>
  `,
})
export class OverlaysInDialog {}
