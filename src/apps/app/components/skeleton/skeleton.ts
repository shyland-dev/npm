import { Component, signal } from '@angular/core';
import { ButtonComponent, delayedFlag, SkeletonComponent, SpinnerComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-skeleton-page',
  imports: [SkeletonComponent, SpinnerComponent, ButtonComponent],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class SkeletonPage {
  protected readonly loading = signal(true);

  /** Carga simulada: `delayedFlag` só mostra o skeleton se a carga passar de 200 ms e o mantém por pelo menos 400 ms. */
  protected readonly fetching = signal(false);
  protected readonly showSkeleton = delayedFlag(this.fetching);
  protected readonly fetchLog = signal('idle');

  protected fetch(ms: number): void {
    this.fetching.set(true);
    this.fetchLog.set(`loading ${ms} ms`);
    setTimeout(() => {
      this.fetching.set(false);
      this.fetchLog.set(`done after ${ms} ms`);
    }, ms);
  }
}
