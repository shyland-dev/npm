import { Component, signal } from '@angular/core';
import { SwitchComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-switch-page',
  imports: [SwitchComponent],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class SwitchPage {
  protected readonly states = ['rest', 'hover', 'focus'] as const;
  protected readonly live = signal(true);
}
