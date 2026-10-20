import { booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input } from '@angular/core';
import { ShyButtonLoadingPosition, ShyButtonSize, ShyButtonVariant } from '../../types/button/button.type';
import { ShyIntent } from '../../types/intent/intent.type';
import { SpinnerComponent } from '../spinner/spinner.component';

/**
 * Botão de ação sobre o elemento nativo: `<button shyButton>` ou `<a shyButton href>`.
 * Ícones nas pontas por projeção: `<shy-icon slot="start">` / `<shy-icon slot="end">`.
 *
 * `loading` deixa o botão com `aria-busy` e `aria-disabled` e ignora cliques, sem `disabled` nativo,
 * para o foco não sair do botão. Em `replace` (padrão) o conteúdo fica transparente sob o spinner e a largura não muda;
 * em `start`/`end` o spinner ocupa o lugar do ícone daquela ponta (sem ícone ali, ele é acrescentado e o botão cresce).
 */
@Component({
  selector: 'button[shyButton], a[shyButton]',
  exportAs: 'shyButton',
  imports: [SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-intent]': 'intent()',
    '[attr.data-size]': 'size()',
    '[attr.data-loading]': 'loading() ? loadingPosition() : null',
    '[attr.data-block]': 'block() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'blocked() ? "true" : null',
    '[attr.disabled]': '!isAnchor && disabled() ? "" : null',
  },
})
export class ButtonComponent {
  readonly variant = input<ShyButtonVariant>('solid');
  readonly intent = input<ShyIntent>('primary');
  readonly size = input<ShyButtonSize>('md');
  /** Ocupado: `aria-busy`, ação bloqueada, foco mantido. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Onde o spinner aparece. Padrão `replace` (largura sempre igual). */
  readonly loadingPosition = input<ShyButtonLoadingPosition>('replace');
  /** Texto exibido no lugar do rótulo durante o loading (só em `start`/`end`). Reserva a largura do maior dos dois. */
  readonly loadingText = input<string>();
  /** Ocupa a largura toda do container. */
  readonly block = input(false, { transform: booleanAttribute });
  /** Em `<button>` vira `disabled` nativo; em `<a>` vira `aria-disabled` e bloqueia o clique. */
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isAnchor: boolean;
  protected readonly blocked = computed(() => this.loading() || (this.isAnchor && this.disabled()));
  protected readonly spinnerAt = computed(() => (this.loading() ? this.loadingPosition() : null));
  protected readonly swapText = computed(() => this.loading() && !!this.loadingText() && this.loadingPosition() !== 'replace');

  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    this.isAnchor = el.tagName.toLowerCase() === 'a';

    // Captura no próprio alvo roda antes dos (click) do consumidor; cancela também o submit e a navegação do link.
    const guard = (event: Event) => {
      if (!this.blocked()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    el.addEventListener('click', guard, true);
    inject(DestroyRef).onDestroy(() => el.removeEventListener('click', guard, true));
  }
}
