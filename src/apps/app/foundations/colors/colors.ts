import { Component } from '@angular/core';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

@Component({
  selector: 'app-colors',
  templateUrl: './colors.html',
})
export class Colors {
  readonly scales = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'].map((name) => ({
    name,
    steps: name === 'neutral' ? [...STEPS.slice(0, 9), 850, ...STEPS.slice(9)].sort((a, b) => a - b) : STEPS,
  }));

  readonly surfaces = ['bg', 'surface', 'surface-raised', 'surface-sunken'];
  readonly texts = ['text', 'text-muted', 'text-subtle', 'text-disabled'];
  readonly intents = ['primary', 'success', 'warning', 'danger', 'info'];
  readonly neutralTokens = [
    { label: 'neutral-soft', bg: 'neutral-soft', fg: 'on-neutral-soft' },
    { label: 'scrim-panel', bg: 'scrim-panel', fg: 'on-scrim' },
  ];
}
