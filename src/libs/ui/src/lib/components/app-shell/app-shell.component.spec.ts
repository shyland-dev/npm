import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyAppShellSidebarMode } from '../../types/app-shell/app-shell.type';
import { AppShellComponent } from './app-shell.component';

@Component({
  imports: [AppShellComponent],
  template: `
    <shy-app-shell [sidebarMode]="mode()" sidebarLabel="Menu">
      <div slot="header" id="head">Logo</div>
      <ul slot="sidebar" id="side">
        <li><a id="link" href="/a">A</a></li>
      </ul>
      <p id="content">Conteúdo</p>
      <div slot="footer" id="foot">Rodapé</div>
    </shy-app-shell>
  `,
})
class Host {
  readonly mode = signal<ShyAppShellSidebarMode>('inline');
}

@Component({ imports: [AppShellComponent], template: `<shy-app-shell><p>só conteúdo</p></shy-app-shell>` })
class Bare {}

@Component({
  imports: [AppShellComponent],
  template: `<shy-app-shell [sidebarMode]="mode()"
    ><div slot="header">Logo</div>
    <p>só conteúdo</p></shy-app-shell
  >`,
})
class NoSidebar {
  readonly mode = signal<ShyAppShellSidebarMode>('inline');
}

function setup(mode: ShyAppShellSidebarMode = 'inline') {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.mode.set(mode);
  fixture.detectChanges();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
}

const flush = async (fixture: { detectChanges(): void; whenStable(): Promise<unknown> }) => {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

describe('AppShellComponent', () => {
  afterEach(() => document.querySelectorAll('dialog.shy-overlay-pane').forEach((d) => d.remove()));

  it('landmarks: banner, navigation nomeada, main e contentinfo, cada um com o seu slot', () => {
    const { root } = setup();
    expect(root.querySelector('header .header-content #head')).not.toBeNull();
    expect(root.querySelector('nav[aria-label="Menu"] .sidebar-inner #side')).not.toBeNull();
    expect(root.querySelector('main #content')).not.toBeNull();
    expect(root.querySelector('footer #foot')).not.toBeNull();
    expect(root.querySelector('.menu')).toBeNull();
  });

  it('skip link aponta para o main e leva o foco até ele (sem mudar a URL)', () => {
    const { root } = setup();
    const skip = root.querySelector<HTMLAnchorElement>('a.skip')!;
    const main = root.querySelector<HTMLElement>('main')!;
    expect(skip.getAttribute('href')).toBe(`#${main.id}`);
    expect(main.getAttribute('tabindex')).toBe('-1');
    document.body.appendChild(root);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    skip.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(main);
    root.remove();
  });

  it('modo drawer: a sidebar sai da grade e o botão abre o Drawer com a mesma navegação', async () => {
    const { fixture, root } = setup('drawer');
    expect(root.querySelector('nav.sidebar')).toBeNull();
    const menu = root.querySelector<HTMLButtonElement>('.menu')!;
    expect(menu.getAttribute('aria-label')).toBe('Open navigation');
    expect(menu.getAttribute('aria-haspopup')).toBe('dialog');
    menu.click();
    await flush(fixture);
    const pane = document.querySelector('dialog.shy-drawer-pane--start');
    expect(pane?.querySelector('nav[aria-label="Menu"] #side')).not.toBeNull();
    expect(pane?.querySelectorAll('#side').length).toBe(1);
  });

  it('clicar num link dentro do Drawer fecha o painel', async () => {
    const { fixture, root } = setup('drawer');
    root.querySelector<HTMLButtonElement>('.menu')!.click();
    await flush(fixture);
    const link = document.querySelector<HTMLAnchorElement>('dialog.shy-drawer-pane--start #link')!;
    link.addEventListener('click', (e) => e.preventDefault());
    link.click();
    await flush(fixture);
    await new Promise((r) => setTimeout(r, 400));
    expect(document.querySelector('dialog.shy-drawer-pane--start')).toBeNull();
  });

  it('voltar para o modo inline fecha o Drawer e devolve a sidebar à grade', async () => {
    const { fixture, host, root } = setup('drawer');
    root.querySelector<HTMLButtonElement>('.menu')!.click();
    await flush(fixture);
    host.mode.set('inline');
    await flush(fixture);
    await new Promise((r) => setTimeout(r, 400));
    expect(document.querySelector('dialog.shy-drawer-pane--start')).toBeNull();
    expect(root.querySelector('nav.sidebar #side')).not.toBeNull();
  });

  it('sem slots, só o main tem conteúdo (as demais regiões ficam vazias para o CSS escondê-las)', () => {
    const fixture = TestBed.createComponent(Bare);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('footer')?.childNodes.length).toBe(0);
    expect(root.querySelector('.header-content')?.childNodes.length).toBe(0);
    expect(root.querySelector('main')?.textContent).toContain('só conteúdo');
  });

  describe('sem conteúdo em slot="sidebar"', () => {
    for (const mode of ['inline', 'auto', 'drawer'] as const) {
      it(`${mode}: sem coluna reservada e sem botão de menu`, async () => {
        const fixture = TestBed.createComponent(NoSidebar);
        fixture.componentInstance.mode.set(mode);
        await flush(fixture);
        const root = fixture.nativeElement as HTMLElement;
        const shell = root.querySelector('shy-app-shell')!;
        expect(shell.hasAttribute('data-no-sidebar')).toBe(true);
        expect(root.querySelector('.menu')).toBeNull();
        expect(root.querySelector('main')?.textContent).toContain('só conteúdo');
      });
    }
  });

  it('com sidebar o comportamento é o de antes: sem data-no-sidebar e com botão no modo drawer', async () => {
    const { fixture, root } = setup('drawer');
    await flush(fixture);
    expect(root.querySelector('shy-app-shell')!.hasAttribute('data-no-sidebar')).toBe(false);
    expect(root.querySelector('.menu')).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.menu')!.click();
    await flush(fixture);
    document.querySelector<HTMLElement>('dialog.shy-drawer-pane--start .close')?.click();
    await flush(fixture);
    await new Promise((r) => setTimeout(r, 400));
    await flush(fixture);
    expect(root.querySelector('.menu')).not.toBeNull();
    expect(root.querySelector('shy-app-shell')!.hasAttribute('data-no-sidebar')).toBe(false);
  });
});
