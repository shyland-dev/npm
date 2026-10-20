import { Component, computed, signal, viewChild } from '@angular/core';
import { IconComponent, ICONS, SnackbarComponent, SnackbarService } from '@shyland-dev/ui';

const MAX_RESULTS = 240;

@Component({
  selector: 'app-icon-page',
  imports: [IconComponent, SnackbarComponent],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class IconPage {
  private readonly snackbar = viewChild.required(SnackbarComponent);

  private readonly allNames = Object.keys(ICONS);
  protected readonly term = signal('');
  protected readonly matches = computed(() => {
    const term = this.term().trim().toLowerCase();
    return term ? this.allNames.filter((name) => name.includes(term)) : this.allNames;
  });
  protected readonly shown = computed(() => this.matches().slice(0, MAX_RESULTS));
  protected readonly total = this.allNames.length;
  protected readonly sizes = [6, 8, 10, 17];

  constructor(private snackbarService: SnackbarService) {}

  async copy(name: string): Promise<void> {
    await navigator.clipboard?.writeText(`<shy-icon>${name}</shy-icon>`);
    this.snackbarService.show({ element: this.snackbar(), text: `Copied: <shy-icon>${name}</shy-icon>`, delay: 2500 });
  }
}
