import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, afterNextRender, effect, inject, input, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconRegistry } from './icon-registry';

/** Mostrado quando o nome não existe no catálogo (o antigo 'help' nunca existiu). */
const FALLBACK = 'question-circle';

/**
 * Ícone SVG inline. O nome vem do conteúdo projetado (`<shy-icon>home</shy-icon>`) ou do input `name`.
 * Decorativo (`aria-hidden`) por padrão; com `label` vira `role="img"`.
 */
@Component({
  selector: 'shy-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class IconComponent {
  private readonly registry = inject(IconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly projected = viewChild.required<ElementRef<HTMLElement>>('projected');

  /** Nome do ícone; se ausente, usa o conteúdo projetado. */
  readonly name = input<string>();
  /** Nome acessível. Sem ele o ícone é decorativo. */
  readonly label = input<string>();
  /** Troca para a variante `-fill` ao passar o ponteiro. */
  readonly hoverFill = input(false);
  /** Duração da transição do fill, em ms. */
  readonly hoverFillDelay = input(0);

  protected readonly hovered = signal(false);
  private readonly projectedName = signal('');

  private readonly resolvedName = computed(() => this.name() ?? this.projectedName());
  // Nome ainda não disponível (catálogo a caminho): vazio, com o tamanho reservado pelo CSS (sem layout shift).
  protected readonly svg = computed(() => {
    const name = this.resolvedName();
    const svg = this.registry.get(name) ?? (this.registry.missing(name) ? this.registry.get(FALLBACK) : undefined);
    return svg ? this.trust(svg) : null;
  });
  protected readonly svgFill = computed(() => {
    const fill = this.hoverFill() ? this.registry.get(`${this.resolvedName()}-fill`) : undefined;
    return fill ? this.trust(fill) : null;
  });

  constructor() {
    effect(() => this.registry.ensure(this.resolvedName()));
    afterNextRender(() => {
      const el = this.projected().nativeElement;
      const read = () => this.projectedName.set(el.textContent?.trim() ?? '');
      read();

      const observer = new MutationObserver(read);
      observer.observe(el, { childList: true, characterData: true, subtree: true });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private trust(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
