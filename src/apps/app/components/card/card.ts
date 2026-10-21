import { Component, signal } from '@angular/core';
import { BadgeComponent, ButtonComponent, CardComponent, ShyCardElevation } from '@shyland-dev/ui';

@Component({
  selector: 'app-card-page',
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardPage {
  protected readonly levels: ShyCardElevation[] = [0, 1, 2, 3];
  protected readonly clicks = signal(0);
}
