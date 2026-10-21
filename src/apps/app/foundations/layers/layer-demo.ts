import { Component, inject } from '@angular/core';
import { ButtonComponent, SHY_OVERLAY_DATA, ShyOverlayLayer, ShyOverlayRef } from '@shyland-dev/ui';

export interface LayerDemoData {
  layer: ShyOverlayLayer;
  order: number;
}

/** Conteúdo de teste dos overlays da página de camadas. */
@Component({
  selector: 'app-layer-demo',
  imports: [ButtonComponent],
  template: `
    <div class="demo" [attr.data-layer]="data.layer">
      <span
        ><strong>{{ data.layer }}</strong> opened #{{ data.order }}</span
      >
      <button shyButton size="sm" variant="outline" type="button" (click)="ref.close()">Close</button>
    </div>
  `,
  styles: `
    .demo {
      display: flex;
      align-items: center;
      gap: var(--shy-space-4);
      min-inline-size: calc(var(--shy-space-32) + var(--shy-space-32));
      padding: var(--shy-space-4);
      border: var(--shy-border-width) solid var(--shy-color-border-strong);
      border-radius: var(--shy-radius-lg);
      background: var(--shy-color-surface-raised);
      box-shadow: var(--shy-shadow-3);
      justify-content: space-between;
    }
  `,
})
export class LayerDemo {
  protected readonly ref = inject(ShyOverlayRef);
  protected readonly data = inject<LayerDemoData>(SHY_OVERLAY_DATA);
}
