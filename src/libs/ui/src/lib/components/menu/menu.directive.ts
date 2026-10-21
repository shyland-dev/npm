import { booleanAttribute, Directive, input, TemplateRef, Type } from '@angular/core';
import { ShyOverlayConfig, ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { OverlayTrigger } from '../../overlay/overlay-trigger';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { ShyPlacement } from '../../types/overlay/overlay.type';
import { menuItems } from './menu-item.component';

/**
 * Botão que abre um menu (padrão APG "menu button"): `<button [shyMenu]="tpl">` com
 * `<ng-template #tpl><shy-menu><button shyMenuItem>…</button></shy-menu></ng-template>`.
 *
 * - Clique, Enter ou Espaço abrem com o foco no primeiro item; ↓ no botão também (primeiro item), ↑ abre no último.
 * - Ativar um item fecha o menu (`shyMenuCloseOnSelect`); Esc fecha e devolve o foco ao botão; Tab fecha e segue a partir do botão.
 * - O gatilho ganha `aria-haspopup="menu"`, `aria-expanded` e `aria-controls`; o menu é nomeado pelo botão (`aria-labelledby`).
 */
@Directive({
  selector: '[shyMenu]',
  exportAs: 'shyMenu',
  host: { 'aria-haspopup': 'menu', '(keydown)': 'onKeydown($event)' },
})
export class MenuDirective extends OverlayTrigger {
  readonly shyMenu = input.required<TemplateRef<ShyOverlayContext> | Type<unknown>>();
  readonly shyMenuPlacement = input<ShyPlacement>('bottom-start');
  /** Fecha o menu ao ativar um item (padrão). Com `false`, o consumidor fecha por `close()`. */
  readonly shyMenuCloseOnSelect = input(true, { transform: booleanAttribute });

  private focusLast = false;

  constructor() {
    super();
    this.tabCloses = 'always';
  }

  protected content() {
    return this.shyMenu();
  }

  protected overlayConfig(): ShyOverlayConfig {
    return {
      layer: 'dropdown',
      modal: false,
      position: { placement: this.shyMenuPlacement() },
      closeOnOutsideClick: true,
      initialFocus: 'none',
    };
  }

  protected override opened(ref: ShyOverlayRef): void {
    const menu = ref.pane.querySelector<HTMLElement>('[role="menu"]');
    if (menu && !menu.hasAttribute('aria-label')) menu.setAttribute('aria-labelledby', this.hostId());
    const items = menuItems(ref.pane);
    (this.focusLast ? items[items.length - 1] : items[0])?.focus();
    this.focusLast = false;
    // Captura: o foco volta ao botão antes do (click) do item, que pode abrir um Dialog (o foco anterior dele passa a ser o botão).
    ref.pane.addEventListener('click', this.onItemCapture, true);
    ref.pane.addEventListener('click', this.onPaneClick);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.expanded() || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
    event.preventDefault();
    this.focusLast = event.key === 'ArrowUp';
    this.open();
  }

  private readonly onItemCapture = (event: Event): void => {
    if (this.shyMenuCloseOnSelect() && this.activatedItem(event)) this.host.focus();
  };

  private activatedItem(event: Event): HTMLElement | null {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
    return item && item.getAttribute('aria-disabled') !== 'true' ? item : null;
  }

  private readonly onPaneClick = (event: Event): void => {
    if (!this.shyMenuCloseOnSelect()) return;
    if (this.activatedItem(event)) this.close();
  };
}
