import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { Typeahead } from '../../utils/typeahead';
import { menuItems } from './menu-item.component';

/**
 * Lista de itens de um menu: `<shy-menu><button shyMenuItem>…</button><shy-divider /></shy-menu>` dentro do `<ng-template>` do `shyMenu`.
 * `role="menu"`; setas (com volta ao início/fim), Home, End e digitação (typeahead: a primeira letra, ou as letras em sequência
 * dentro de meio segundo) movem o foco entre os itens. Enter/Espaço ativam o item (o `shyMenu` fecha o painel).
 * O nome vem do botão que abriu o menu (`aria-labelledby`), ou de `label`.
 */
@Component({
  selector: 'shy-menu',
  template: '<ng-content />',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menu',
    'aria-orientation': 'vertical',
    '[attr.aria-label]': 'label()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class MenuComponent {
  /** Nome acessível, se o menu não for rotulado pelo botão que o abre. */
  readonly label = input<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly search = new Typeahead();

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const items = menuItems(this.host);
    if (!items.length) return;
    const current = items.indexOf(this.host.ownerDocument.activeElement as HTMLElement);

    let next = -1;
    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % items.length;
        break;
      case 'ArrowUp':
        next = current <= 0 ? items.length - 1 : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        if (event.key.length === 1 && event.key !== ' ') {
          next = this.search.find(
            items.map((item) => item.textContent ?? ''),
            current,
            event.key,
          );
        } else return;
    }
    event.preventDefault();
    if (next >= 0) items[next].focus();
  }
}
