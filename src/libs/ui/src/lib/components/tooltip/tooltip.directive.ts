import { DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { ShyPlacement } from '../../types/overlay/overlay.type';
import { TooltipComponent } from './tooltip.component';

let nextId = 0;

/**
 * Dica de texto curto no hover (mouse) e no foco por teclado: `<button shyIconButton shyTooltip="Excluir" aria-label="Excluir">`.
 *
 * - Complementa o nome do elemento, nunca o substitui: o texto só vira `aria-describedby` enquanto aberto, e no toque não aparece.
 *   Informação essencial vai no rótulo ou no corpo da página.
 * - WCAG 1.4.13: dispensável (Esc, sem mover o foco), pairável (o ponteiro pode ir até a dica) e persistente (some por Esc, saída do ponteiro/foco ou clique).
 * - Atrasos em `--shy-delay-tooltip` (abrir) e `--shy-delay-tooltip-hide` (fechar).
 */
@Directive({
  selector: '[shyTooltip]',
  exportAs: 'shyTooltip',
  host: {
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'scheduleHide()',
    '(pointerdown)': 'hide()',
    '(focus)': 'onFocus()',
    '(blur)': 'hide()',
  },
})
export class TooltipDirective {
  /** Texto da dica. Vazio desativa. */
  readonly shyTooltip = input<string>('');
  readonly shyTooltipPlacement = input<ShyPlacement>('top');

  private readonly overlay = inject(OverlayService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly id = `shy-tooltip-${nextId++}`;
  private ref: ShyOverlayRef | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private previousDescribedBy: string | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      void this.ref?.finish(undefined, false);
    });
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;
    this.scheduleShow(this.delay('--shy-delay-tooltip', 500));
  }

  protected onFocus(): void {
    let visible = false;
    try {
      visible = this.host.matches(':focus-visible');
    } catch {
      // seletor não suportado: sem dica no foco
    }
    if (visible) this.scheduleShow(0);
  }

  private scheduleShow(delay: number): void {
    clearTimeout(this.timer);
    if (this.ref) return;
    this.timer = setTimeout(() => this.show(), delay);
  }

  protected scheduleHide(): void {
    clearTimeout(this.timer);
    if (!this.ref) return;
    this.timer = setTimeout(() => this.hide(), this.delay('--shy-delay-tooltip-hide', 100));
  }

  private show(): void {
    const text = this.shyTooltip();
    if (!text || this.ref) return;
    const ref = this.overlay.open(TooltipComponent, {
      layer: 'tooltip',
      modal: false,
      anchor: this.host,
      position: { placement: this.shyTooltipPlacement() },
      closeOnOutsideClick: false,
      restoreFocus: false,
      initialFocus: 'none',
      role: 'tooltip',
      data: text,
    });
    this.ref = ref;
    ref.pane.id = this.id;
    // O ponteiro pode ir até a dica sem fechá-la (WCAG 1.4.13: pairável).
    ref.pane.addEventListener('pointerenter', this.keepOpen);
    ref.pane.addEventListener('pointerleave', () => this.scheduleHide());
    this.previousDescribedBy = this.host.getAttribute('aria-describedby');
    this.host.setAttribute('aria-describedby', [this.previousDescribedBy, this.id].filter(Boolean).join(' '));
    void ref.closed.then(() => {
      if (this.ref !== ref) return;
      this.ref = null;
      if (this.previousDescribedBy) this.host.setAttribute('aria-describedby', this.previousDescribedBy);
      else this.host.removeAttribute('aria-describedby');
    });
  }

  private readonly keepOpen = (): void => clearTimeout(this.timer);

  /** Fecha agora (e cancela uma abertura pendente). */
  hide(): void {
    clearTimeout(this.timer);
    void this.ref?.close();
  }

  private delay(token: string, fallback: number): number {
    const value = parseFloat(getComputedStyle(this.host.ownerDocument.documentElement).getPropertyValue(token));
    return Number.isFinite(value) ? value : fallback;
  }
}
