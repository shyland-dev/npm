import { Component, signal } from '@angular/core';
import { ButtonComponent, SkeletonComponent, SpinnerComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-skeleton-page',
  imports: [SkeletonComponent, SpinnerComponent, ButtonComponent],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class SkeletonPage {
  protected readonly loading = signal(true);
}
