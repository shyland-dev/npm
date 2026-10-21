import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, IconComponent, ShyButtonVariant, ShyIntent } from '@shyland-dev/ui';

@Component({
  selector: 'app-button-page',
  imports: [ButtonComponent, IconComponent, RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonPage {
  protected readonly variants: ShyButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link'];
  protected readonly intents: ShyIntent[] = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'];
  protected readonly states = ['hover', 'focus', 'active'];

  protected readonly saving = signal(false);
  protected readonly saves = signal(0);

  protected save(): void {
    this.saving.set(true);
    this.saves.update((n) => n + 1);
    setTimeout(() => this.saving.set(false), 2000);
  }
}
