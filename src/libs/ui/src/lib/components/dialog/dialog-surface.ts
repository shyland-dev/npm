import { booleanAttribute, Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { ShyOverlayRef } from '../../overlay/overlay-ref';

let nextId = 0;

/**
 * Base interna de `shy-dialog` e `shy-drawer`: título, corpo e botão de fechar. Quando o conteúdo está num painel do
 * `OverlayService`, liga o `<dialog>` ao título e ao corpo por `aria-labelledby`/`aria-describedby`, a menos que quem abriu
 * já tenha definido esses atributos (o painel é achado pelo DOM, então vale também para `TemplateRef`).
 * O botão de fechar fecha o `ShyOverlayRef` quando ele é injetável (componente aberto pelo serviço); num template, use
 * `(dismissed)="ref.close()"` com o `overlayRef` do contexto. Não é exportada.
 */
@Directive()
export abstract class DialogSurface {
  /** Título do painel: vira o nome acessível do `<dialog>`. */
  readonly heading = input<string>();
  /** Mostra o botão de fechar. Em `alertdialog` (confirmações) deixe `false`. */
  readonly dismissible = input(true, { transform: booleanAttribute });
  /** Nome acessível do botão de fechar. */
  readonly closeLabel = input('Close');
  /** Emitido pelo botão de fechar. Quando há `ShyOverlayRef`, ele também é fechado. */
  readonly dismissed = output<void>();

  private readonly ref = inject(ShyOverlayRef, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly uid = `shy-dialog-${nextId++}`;
  protected readonly titleId = `${this.uid}-title`;
  protected readonly bodyId = `${this.uid}-body`;

  constructor() {
    effect(() => {
      const pane = this.host.closest<HTMLElement>('.shy-overlay-pane');
      if (!pane) return;
      if (!pane.hasAttribute('aria-label') && !pane.hasAttribute('aria-labelledby') && this.heading()) pane.setAttribute('aria-labelledby', this.titleId);
      if (!pane.hasAttribute('aria-describedby')) pane.setAttribute('aria-describedby', this.bodyId);
    });
  }

  protected dismiss(): void {
    this.dismissed.emit();
    void this.ref?.close();
  }
}
