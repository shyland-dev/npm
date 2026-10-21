import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, TemplateRef, afterNextRender, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { ShyAppShellSidebarMode } from '../../types/app-shell/app-shell.type';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { DrawerService } from '../../services/drawer/drawer.service';
import { DrawerComponent } from '../drawer/drawer.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

let nextId = 0;

/**
 * Casca de página: `header`, `sidebar`, conteúdo (`main`) e `footer` por projeção, sem router próprio.
 * `<shy-app-shell><div slot="header">…</div><nav slot="sidebar">…</nav>conteúdo<div slot="footer">…</div></shy-app-shell>`.
 * Os landmarks (`banner`, `navigation`, `main`, `contentinfo`) e o link "pular para o conteúdo" são da casca; as regiões
 * sem conteúdo não aparecem. Abaixo do breakpoint `md` a sidebar vira um Drawer aberto por um botão no cabeçalho
 * (fecha ao navegar por um link dentro dela). O breakpoint vive só no CSS (`_breakpoints.scss`); o componente lê o
 * resultado da custom property `--_compact`.
 */
@Component({
  selector: 'shy-app-shell',
  exportAs: 'shyAppShell',
  imports: [NgTemplateOutlet, DrawerComponent, IconButtonComponent, IconComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-compact]': 'compact() ? "" : null',
  },
})
export class AppShellComponent {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly drawer = inject(DrawerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly sidebarMode = input<ShyAppShellSidebarMode>('auto');
  /** Nome acessível da navegação lateral (e título do Drawer). */
  readonly sidebarLabel = input('Navigation');
  readonly menuLabel = input('Open navigation');
  readonly skipLabel = input('Skip to content');

  protected readonly mainId = `shy-app-shell-main-${nextId++}`;
  private readonly measured = signal(false);
  protected readonly compact = computed(() => (this.sidebarMode() === 'auto' ? this.measured() : this.sidebarMode() === 'drawer'));

  private readonly drawerTpl = viewChild.required<TemplateRef<ShyOverlayContext>>('drawerTpl');
  private drawerRef?: ShyOverlayRef;

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser || typeof ResizeObserver === 'undefined') return;
      const read = () => this.measured.set(getComputedStyle(this.el).getPropertyValue('--_compact').trim() === '1');
      const observer = new ResizeObserver(read);
      observer.observe(this.el);
      read();
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
    // Voltar para a tela larga com o Drawer aberto: a sidebar volta para a grade.
    effect(() => {
      if (!this.compact()) void this.drawerRef?.close();
    });
  }

  /** Abre o Drawer da sidebar (só faz sentido no modo compacto). */
  openSidebar(): void {
    if (this.drawerRef) return;
    const ref = this.drawer.open(this.drawerTpl(), { side: 'start' });
    this.drawerRef = ref;
    void ref.closed.then(() => (this.drawerRef = undefined));
  }

  protected onSidebarClick(event: Event): void {
    if ((event.target as HTMLElement).closest('a[href]')) void this.drawerRef?.close();
  }

  protected skip(event: Event): void {
    event.preventDefault();
    this.el.querySelector<HTMLElement>(`[id="${this.mainId}"]`)?.focus();
  }
}
