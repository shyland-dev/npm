import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
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
  private typed = '';
  private typedAt = 0;

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
        if (event.key.length === 1 && event.key !== ' ') next = this.typeahead(event.key, items, current);
        else return;
    }
    event.preventDefault();
    if (next >= 0) items[next].focus();
  }

  /** Letras seguidas dentro de 500 ms formam um prefixo; a mesma letra repetida percorre os itens que começam com ela. */
  private typeahead(char: string, items: HTMLElement[], current: number): number {
    const now = Date.now();
    this.typed = now - this.typedAt > 500 ? char.toLowerCase() : this.typed + char.toLowerCase();
    this.typedAt = now;

    const starts = (item: HTMLElement) => (item.textContent ?? '').trim().toLowerCase().startsWith(this.typed);
    const repeated = this.typed.length > 1 && [...this.typed].every((c) => c === this.typed[0]);
    const prefix = repeated ? this.typed[0] : this.typed;
    const matches = (item: HTMLElement) => (item.textContent ?? '').trim().toLowerCase().startsWith(prefix);

    // Começa depois do item atual quando a busca é de uma letra só (ou repetida), para percorrer os iguais.
    const from = this.typed.length === 1 || repeated ? current + 1 : Math.max(current, 0);
    for (let i = 0; i < items.length; i++) {
      const index = (from + i) % items.length;
      if (matches(items[index]) && (repeated || starts(items[index]) || this.typed.length === 1)) return index;
    }
    return -1;
  }
}
