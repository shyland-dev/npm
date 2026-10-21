import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, CheckboxComponent, DrawerComponent, SHY_OVERLAY_DATA, ShyDrawerSide, ShyOverlayRef } from '@shyland-dev/ui';

@Component({
  selector: 'app-demo-drawer',
  imports: [DrawerComponent, ButtonComponent, CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <shy-drawer heading="Filters" closeLabel="Close filters">
      <div class="shy-stack">
        @for (option of options; track option) {
          <shy-checkbox>{{ option }}</shy-checkbox>
        }
      </div>
      <div slot="footer">
        <button shyButton variant="ghost" intent="neutral" type="button" (click)="ref.close()">Cancel</button>
        <button shyButton type="button" (click)="ref.close(true)">Apply ({{ side }})</button>
      </div>
    </shy-drawer>
  `,
})
export class DemoDrawer {
  protected readonly ref = inject<ShyOverlayRef<boolean>>(ShyOverlayRef);
  protected readonly side = inject<ShyDrawerSide>(SHY_OVERLAY_DATA);
  protected readonly options = Array.from({ length: 24 }, (_, i) => `Filter option ${i + 1}`);
}
