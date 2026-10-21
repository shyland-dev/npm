import { ChangeDetectionStrategy, Component, computed, contentChildren, ElementRef, inject, input, model } from '@angular/core';
import { ShyTabsActivation, ShyTabsOrientation } from '../../types/tabs/tabs.type';
import { TabComponent } from './tab.component';
import { SHY_TABS, ShyTabsContext } from './tabs.token';

/**
 * Abas (APG Tabs): `<shy-tabs [(value)]="tab" label="Conta"><shy-tab value="a" label="Perfil">…</shy-tab></shy-tabs>`.
 * Roving tabindex: Tab entra na aba selecionada; setas movem (invertidas em RTL), Home/End vão às pontas e abas desabilitadas são puladas.
 * Em `activation="automatic"` (padrão) o foco já seleciona; em `manual` Enter/Espaço (clique do botão) seleciona.
 * Sem `value` (ou com valor sem aba), a primeira aba habilitada é a exibida.
 */
@Component({
  selector: 'shy-tabs',
  exportAs: 'shyTabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SHY_TABS, useExisting: TabsComponent }],
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
})
export class TabsComponent implements ShyTabsContext {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  readonly value = model<unknown>(undefined);
  readonly orientation = input<ShyTabsOrientation>('horizontal');
  readonly activation = input<ShyTabsActivation>('automatic');
  /** Nome acessível da lista de abas (`aria-label`). */
  readonly label = input<string>();

  protected readonly tabs = contentChildren(TabComponent);
  readonly selectedTab = computed(() => {
    const enabled = this.tabs().filter((tab) => !tab.disabled());
    return enabled.find((tab) => tab.value() === this.value()) ?? enabled[0];
  });

  protected select(tab: TabComponent): void {
    this.value.set(tab.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    const enabled = this.tabs().filter((tab) => !tab.disabled());
    const current = enabled.findIndex((tab) => tab.tabId === (event.target as HTMLElement).id);
    if (current < 0) return;

    const vertical = this.orientation() === 'vertical';
    const rtl = !vertical && getComputedStyle(this.el).direction === 'rtl';
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';

    let target: number;
    if (event.key === forward) target = (current + 1) % enabled.length;
    else if (event.key === backward) target = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = enabled.length - 1;
    else return;

    event.preventDefault();
    const tab = enabled[target];
    this.el.querySelector<HTMLElement>(`[id="${tab.tabId}"]`)?.focus();
    if (this.activation() === 'automatic') this.select(tab);
  }
}
