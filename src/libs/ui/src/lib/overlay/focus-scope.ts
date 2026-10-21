import { DOCUMENT } from '@angular/common';
import { afterNextRender, booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { ShyInitialFocus } from '../types/overlay/overlay.type';

const FOCUSABLE = ['a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'audio[controls]', 'video[controls]', 'summary', '[contenteditable]:not([contenteditable="false"])', '[tabindex]'].join(',');

/** Elementos alcançáveis por Tab dentro de `root`, na ordem do DOM (`tabindex` positivo não é suportado: anti-padrão). */
export function focusableElements(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.tabIndex >= 0 && !el.closest('[hidden], [inert]') && !el.closest('fieldset:disabled'));
}

/** Aplica o foco inicial. Com `first`, prefere `[autofocus]`; sem focável, foca o próprio `root` (precisa de `tabindex="-1"`). */
export function focusInitial(root: HTMLElement, target: ShyInitialFocus = 'first'): void {
  if (target === 'none') return;
  if (target instanceof HTMLElement) return target.focus();
  if (target === 'first') {
    const auto = root.querySelector<HTMLElement>('[autofocus]');
    const el = auto ?? focusableElements(root)[0];
    if (el) return el.focus();
  }
  root.focus();
}

/** Mantém o Tab dentro de `root` (ciclo do último para o primeiro e vice-versa). Retorna `true` se tratou o evento. */
export function trapTab(root: HTMLElement, event: KeyboardEvent): boolean {
  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return false;
  const items = focusableElements(root);
  if (!items.length) {
    event.preventDefault();
    root.focus();
    return true;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = root.ownerDocument.activeElement;
  const outside = !(active instanceof Node) || !root.contains(active) || active === root;
  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

/** Devolve o foco a `el`, se ele ainda estiver no documento. */
export function restoreFocus(el: Element | null): void {
  if (el instanceof HTMLElement && el.isConnected) el.focus();
}

/**
 * Escopo de foco para conteúdo que o app renderiza sozinho (o `OverlayService` usa as mesmas funções):
 * guarda o foco anterior, aplica o foco inicial, prende o Tab com `shyFocusScopeTrap` e devolve o foco ao ser destruído.
 */
@Directive({
  selector: '[shyFocusScope]',
  host: {
    tabindex: '-1',
    '(keydown)': 'onKeydown($event)',
  },
})
export class FocusScopeDirective {
  readonly shyFocusScopeTrap = input(false, { transform: booleanAttribute });
  readonly shyFocusScopeInitial = input<ShyInitialFocus>('first');
  readonly shyFocusScopeRestore = input(true, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly previous = inject(DOCUMENT).activeElement;

  constructor() {
    afterNextRender(() => focusInitial(this.host, this.shyFocusScopeInitial()));
    inject(DestroyRef).onDestroy(() => {
      if (this.shyFocusScopeRestore()) restoreFocus(this.previous);
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.shyFocusScopeTrap()) trapTab(this.host, event);
  }
}
