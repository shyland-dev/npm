import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ButtonComponent, ProgressCircularComponent, ProgressComponent, ShyProgressSize, ShySpinnerSize } from '@shyland-dev/ui';

@Component({
  selector: 'app-progress-page',
  imports: [ProgressComponent, ProgressCircularComponent, ButtonComponent],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class ProgressPage {
  protected readonly linearSizes: ShyProgressSize[] = ['sm', 'md', 'lg'];
  protected readonly circularSizes: ShySpinnerSize[] = ['xs', 'sm', 'md', 'lg'];
  protected readonly steps = [0, 25, 60, 100];

  protected readonly value = signal(0);
  protected readonly running = computed(() => this.value() > 0 && this.value() < 100);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected start(): void {
    clearInterval(this.timer);
    this.value.set(1);
    this.timer = setInterval(() => {
      this.value.update((v) => Math.min(v + 7, 100));
      if (this.value() >= 100) clearInterval(this.timer);
    }, 300);
  }
}
