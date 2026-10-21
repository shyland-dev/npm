import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { ShySnackbarConfig } from '../../interfaces/snackbar/snackbar.interface';

export const SHY_SNACKBAR_DEFAULTS: ShySnackbarConfig = { maxVisible: 3, duration: 5000, durationWithAction: 8000, dismissLabel: 'Dismiss' };

export const SHY_SNACKBAR_CONFIG = new InjectionToken<ShySnackbarConfig>('SHY_SNACKBAR_CONFIG', { factory: () => SHY_SNACKBAR_DEFAULTS });

/** Ajusta os padrões do Snackbar: `provideShySnackbar({ maxVisible: 2, duration: 6000 })`. Opcional. */
export function provideShySnackbar(config: Partial<ShySnackbarConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SHY_SNACKBAR_CONFIG, useValue: { ...SHY_SNACKBAR_DEFAULTS, ...config } }]);
}
