import { InjectionToken, Signal } from '@angular/core';

/** O que o `shy-tabs` oferece aos `shy-tab` filhos. */
export interface ShyTabsContext {
  /** A aba exibida (o `shy-tab` em si; comparado por identidade). */
  readonly selectedTab: Signal<object | undefined>;
}

export const SHY_TABS = new InjectionToken<ShyTabsContext>('SHY_TABS');
