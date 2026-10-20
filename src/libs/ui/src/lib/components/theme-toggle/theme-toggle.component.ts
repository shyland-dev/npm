import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ShyThemeMode, ThemeService } from '../../services/theme/theme.service';

export interface ShyThemeToggleLabels {
  group: string;
  light: string;
  system: string;
  dark: string;
}

const MODES: readonly ShyThemeMode[] = ['light', 'system', 'dark'];

/** Controle segmentado claro / sistema / escuro (radiogroup com roving tabindex, padrão APG). */
@Component({
  selector: 'shy-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly theme = inject(ThemeService);

  readonly labels = input<ShyThemeToggleLabels>({ group: 'Theme', light: 'Light', system: 'System', dark: 'Dark' });

  protected readonly modes = MODES;
  protected readonly mode = this.theme.mode;
  protected readonly options = computed(() => MODES.map((value) => ({ value, label: this.labels()[value] })));

  protected select(mode: ShyThemeMode): void {
    this.theme.setMode(mode);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;

    event.preventDefault();
    const next = MODES[(MODES.indexOf(this.mode()) + step + MODES.length) % MODES.length];
    this.select(next);
    (event.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-mode="${next}"]`)?.focus();
  }
}
