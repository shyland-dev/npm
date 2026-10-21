import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SHY_TABS } from './tabs.token';

let nextId = 0;

/**
 * Uma aba de `shy-tabs`: o conteúdo projetado é o painel (`role="tabpanel"`), o `label` vira o botão da lista.
 * `value` identifica a aba em `[(value)]` do `shy-tabs`.
 */
@Component({
  selector: 'shy-tab',
  exportAs: 'shyTab',
  template: '<ng-content />',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tabpanel',
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'tabId',
    '[attr.tabindex]': 'selected() ? 0 : null',
    '[hidden]': '!selected()',
  },
})
export class TabComponent {
  private readonly tabs = inject(SHY_TABS);
  private readonly uid = nextId++;

  readonly value = input.required<unknown>();
  /** Texto do botão da aba (nome acessível do painel). */
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly tabId = `shy-tab-${this.uid}`;
  readonly panelId = `shy-tabpanel-${this.uid}`;
  readonly selected = computed(() => this.tabs.selectedTab() === this);
}
