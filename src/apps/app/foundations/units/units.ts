import { Component, ElementRef, HostListener, afterNextRender, signal, viewChild } from '@angular/core';
import { ru } from '@shyland-dev/ui';

const REM = 16;
const MULTIPLIERS = [6, 7, 7.5, 8, 14, 18, 22];
const VIEWPORTS: [string, number, number][] = [
  ['Phone 360×800', 360, 800],
  ['Phone 390×844', 390, 844],
  ['Tablet 768×1024', 768, 1024],
  ['Laptop 1366×768', 1366, 768],
  ['FHD 1920×1080', 1920, 1080],
  ['QHD 2560×1440', 2560, 1440],
  ['4K 3840×2160', 3840, 2160],
];

@Component({
  selector: 'app-units',
  templateUrl: './units.html',
})
export class Units {
  readonly probe = viewChild.required<ElementRef<HTMLElement>>('probe');

  readonly multipliers = MULTIPLIERS;
  readonly rows = VIEWPORTS.map(([label, w, h]) => {
    const unit = 0.1 * REM + (0.1 * Math.min(w, h)) / 100;
    return { label, unit, cells: MULTIPLIERS.map((m) => m * unit) };
  });

  readonly measured = signal(0);
  readonly viewport = signal('');
  protected readonly ru = ru;

  constructor() {
    afterNextRender(() => this.measure());
  }

  @HostListener('window:resize')
  measure(): void {
    this.measured.set(this.probe().nativeElement.getBoundingClientRect().width);
    this.viewport.set(`${window.innerWidth}×${window.innerHeight}`);
  }
}
