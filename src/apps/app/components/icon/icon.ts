import { Component, computed, inject, signal } from '@angular/core';
import { IconComponent, SnackbarService } from '@shyland-dev/ui';
import { ICONS } from '@shyland-dev/ui/icons';

const MAX_RESULTS = 240;

@Component({
  selector: 'app-icon-page',
  imports: [IconComponent],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class IconPage {
  private readonly snackbar = inject(SnackbarService);

  private readonly allNames = Object.keys(ICONS);
  protected readonly term = signal('');
  protected readonly matches = computed(() => {
    const term = this.term().trim().toLowerCase();
    return term ? this.allNames.filter((name) => name.includes(term)) : this.allNames;
  });
  protected readonly shown = computed(() => this.matches().slice(0, MAX_RESULTS));
  protected readonly total = this.allNames.length;
  protected readonly sizes = [6, 8, 10, 17];

  async copy(name: string): Promise<void> {
    await navigator.clipboard?.writeText(`<shy-icon>${name}</shy-icon>`);
    this.snackbar.show(`Copied: <shy-icon>${name}</shy-icon>`, { intent: 'success', duration: 2500 });
  }
}
