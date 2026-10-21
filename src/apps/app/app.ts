import { Component, inject, OnInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DebugService } from '@shyland-dev/utils';
import { ThemeToggleComponent } from '@shyland-dev/ui';

interface NavGroup {
  label: string;
  items: { path: string; label: string }[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly document = inject(DOCUMENT);

  readonly nav: NavGroup[] = [
    {
      label: 'Components',
      items: ['accordion', 'alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'checkbox', 'dialog', 'divider', 'drawer', 'empty-state', 'form-field', 'icon', 'icon-button', 'input', 'list', 'menu', 'pagination', 'popover', 'progress', 'radio', 'select', 'skeleton', 'snackbar', 'spinner', 'switch', 'table', 'tabs', 'textarea', 'tooltip'].map((name) => ({ path: `components/${name}`, label: name })),
    },
    {
      label: 'Examples',
      items: [
        { path: 'examples/form', label: 'complete form' },
        { path: 'examples/overlays', label: 'overlays together' },
      ],
    },
    {
      label: 'Foundations',
      items: ['colors', 'typography', 'units', 'spacing', 'motion', 'layers'].map((name) => ({ path: `foundations/${name}`, label: name })),
    },
  ];

  readonly reducedMotion = signal(false);
  readonly sansFont = signal(false);

  constructor(private debugService: DebugService) {
    this.debugService.log(this);
  }

  ngOnInit(): void {
    this.debugService.log(this);
  }

  toggleMotion(): void {
    this.reducedMotion.update((v) => !v);
    const root = this.document.documentElement;
    if (this.reducedMotion()) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');
  }

  toggleFont(): void {
    this.sansFont.update((v) => !v);
    this.document.documentElement.style.setProperty('--shy-font-family-base', this.sansFont() ? 'var(--shy-font-family-sans)' : 'var(--shy-font-family-mono)');
  }
}
