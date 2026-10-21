import { booleanAttribute, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input } from '@angular/core';

/**
 * Item de um `shy-menu`: `<button shyMenuItem>` ou `<a shyMenuItem href>`. `role="menuitem"` e foco por roving
 * (`tabindex="-1"`: o `shy-menu` move o foco com as setas). `disabled` mantém o item focável (`aria-disabled`, padrão APG)
 * mas ignora o clique, o Enter e o Espaço. Ícones nas pontas por projeção: `slot="start"` e `slot="end"`.
 */
@Component({
  selector: 'button[shyMenuItem], a[shyMenuItem]',
  exportAs: 'shyMenuItem',
  template: '<ng-content select="[slot=start]" /><span class="label"><ng-content /></span><ng-content select="[slot=end]" />',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menuitem',
    tabindex: '-1',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.type]': 'isButton ? "button" : null',
  },
})
export class MenuItemComponent {
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isButton: boolean;

  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    this.isButton = el.tagName.toLowerCase() === 'button';
    // `disabled` estático viraria o atributo nativo e tiraria o item do foco; aqui só vale o input (aria-disabled).
    el.removeAttribute('disabled');

    // Captura no próprio item: roda antes dos (click) do consumidor e cancela também a navegação do link.
    const guard = (event: Event) => {
      if (!this.disabled()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    el.addEventListener('click', guard, true);
    inject(DestroyRef).onDestroy(() => el.removeEventListener('click', guard, true));
  }
}

/** Itens do menu na ordem do DOM (inclui os desabilitados, que continuam focáveis). */
export function menuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}
