import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ButtonComponent, OverlayService, ShyOverlayLayer } from '@shyland-dev/ui';
import { LayerDemo } from './layer-demo';

interface OpenLayer {
  id: number;
  layer: ShyOverlayLayer;
}

@Component({
  selector: 'app-layers',
  imports: [ButtonComponent],
  templateUrl: './layers.html',
  styleUrl: './layers.scss',
})
export class Layers {
  private readonly overlay = inject(OverlayService);
  private counter = 0;
  private readonly popoverButton = viewChild.required('popover', { read: ElementRef<HTMLElement> });

  readonly layers = ['base', 'raised', 'dropdown', 'sticky', 'fixed', 'drawer', 'modal', 'popover', 'tooltip', 'toast'];
  readonly stack = this.layers.map((name, index) => ({ name, value: index * 100, order: index }));

  /** Ordens de abertura para testar a promoção: o topo da tela deve ser sempre popover/toast, nunca o modal. */
  readonly presets: { label: string; order: ShyOverlayLayer[] }[] = [
    { label: 'modal → popover → toast', order: ['modal', 'popover', 'toast'] },
    { label: 'toast → popover → modal', order: ['toast', 'popover', 'modal'] },
    { label: 'popover → modal → toast', order: ['popover', 'modal', 'toast'] },
  ];

  /** Overlays abertos, do mais antigo (primeiro) ao mais novo (topo). */
  readonly opened = signal<OpenLayer[]>([]);

  open(layer: ShyOverlayLayer): void {
    const id = ++this.counter;
    const ref = this.overlay.open(LayerDemo, {
      layer,
      anchor: layer === 'popover' || layer === 'tooltip' ? this.popoverButton().nativeElement : undefined,
      position: { placement: 'bottom-start' },
      paneClass: layer === 'toast' ? 'layers-toast' : undefined,
      closeOnOutsideClick: layer === 'popover' || layer === 'tooltip',
      ariaLabel: `${layer} overlay`,
      data: { layer, order: id },
    });
    this.opened.update((list) => [...list, { id, layer }]);
    void ref.closed.then(() => this.opened.update((list) => list.filter((item) => item.id !== id)));
  }

  openOrder(order: ShyOverlayLayer[]): void {
    for (const layer of order) this.open(layer);
  }

  closeAll(): void {
    void this.overlay.closeAll();
  }
}
