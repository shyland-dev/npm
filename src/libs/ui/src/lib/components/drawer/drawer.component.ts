import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { DialogSurface } from '../dialog/dialog-surface';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Conteúdo de um painel lateral aberto por `DrawerService.open()`: título, corpo com rolagem e ações (`slot="footer"`).
 * O painel em si (posição, tamanho, fundo, borda e entrada por lado) é do `.shy-drawer-pane` de `styles/drawer.css`;
 * o lado vem da abertura (`DrawerService.open(Comp, { side })`), não deste componente.
 * Em `bottom`, `showHandle` mostra um handle e `dragToClose` deixa arrastar o cabeçalho ou o handle para fechar (ver `ShyDrawerConfig`).
 * Mesma API de `shy-dialog` para `heading`, `dismissible`, `closeLabel` e `dismissed`.
 */
@Component({
  selector: 'shy-drawer',
  imports: [IconButtonComponent, IconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent extends DialogSurface {
  /** `DrawerService.open(..., { showHandle: true })` marca o painel; o handle é um botão que fecha (e inicia o arrasto de `dragToClose`). */
  protected readonly handle = signal(false);

  constructor() {
    super();
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => this.handle.set(host.closest('.shy-overlay-pane')?.hasAttribute('data-shy-handle') ?? false));
  }
}
