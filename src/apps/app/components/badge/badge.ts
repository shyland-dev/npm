import { Component, signal } from '@angular/core';
import { BadgeComponent, ShyBadgeVariant, ShyIntent } from '@shyland-dev/ui';

@Component({
  selector: 'app-badge-page',
  imports: [BadgeComponent],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class BadgePage {
  protected readonly intents: ShyIntent[] = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'];
  protected readonly variants: ShyBadgeVariant[] = ['soft', 'solid', 'outline'];
  protected readonly tags = signal(['Angular', 'Design system', 'Accessibility']);

  protected remove(tag: string): void {
    this.tags.update((list) => list.filter((t) => t !== tag));
  }
}
