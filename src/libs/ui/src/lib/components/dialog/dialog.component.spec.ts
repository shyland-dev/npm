import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyOverlayContext } from '../../interfaces/overlay/overlay.interface';
import { ShyOverlayRef } from '../../overlay/overlay-ref';
import { OverlayService } from '../../overlay/overlay.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { DrawerService } from '../../services/drawer/drawer.service';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog.component';
import { DrawerComponent } from '../drawer/drawer.component';

@Component({
  imports: [DialogComponent, ButtonComponent],
  template: `
    <shy-dialog heading="Excluir projeto" size="lg" closeLabel="Fechar" (dismissed)="dismissed = dismissed + 1">
      Isso não pode ser desfeito.
      <div slot="footer"><button shyButton id="ok" type="button">Excluir</button></div>
    </shy-dialog>
  `,
})
class Content {
  dismissed = 0;
}

@Component({
  imports: [DrawerComponent],
  template: `<shy-drawer heading="Filtros"><input id="field" /></shy-drawer>`,
})
class DrawerContent {}

@Component({
  imports: [DialogComponent],
  template: `<shy-dialog [dismissible]="false"><p id="only">sem título</p></shy-dialog>`,
})
class Untitled {}

@Component({
  imports: [DialogComponent],
  template: `
    <ng-template #tpl let-ref="overlayRef">
      <shy-dialog heading="Do template" (dismissed)="ref.close(2)"><button id="in-tpl" (click)="ref.close(1)">x</button></shy-dialog>
    </ng-template>
  `,
})
class TemplateHost {
  readonly tpl = viewChild.required<TemplateRef<ShyOverlayContext>>('tpl');
}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement;

describe('DialogComponent / DialogService', () => {
  let dialogs: DialogService;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    dialogs = TestBed.inject(DialogService);
    trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
  });

  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    trigger.remove();
    document.documentElement.removeAttribute('data-shy-scroll-lock');
  });

  it('open abre um <dialog> modal com o título ligado por aria-labelledby e o corpo por aria-describedby', () => {
    const ref = dialogs.open(Content);
    const dialog = pane() as HTMLDialogElement;
    const title = dialog.querySelector('h2')!;

    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog.dataset['layer']).toBe('modal');
    expect(title.textContent).toBe('Excluir projeto');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe(dialog.querySelector('.body')!.id);
    expect(dialog.querySelector('shy-dialog')?.getAttribute('data-size')).toBe('lg');
    expect(ref.isOpen()).toBe(true);
  });

  it('o botão de fechar tem nome, emite dismissed e fecha o overlay', async () => {
    const ref = dialogs.open(Content);
    const close = pane().querySelector('.close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Fechar');

    close.click();
    expect(await ref.closed).toBeUndefined();
    expect((ref.componentInstance as Content).dismissed).toBe(1);
    expect(document.querySelector('.shy-overlay-pane')).toBeNull();
  });

  it('dismissible: false esconde o X; sem título não cria aria-labelledby', () => {
    dialogs.open(Untitled);
    expect(pane().querySelector('.close')).toBeNull();
    expect(pane().hasAttribute('aria-labelledby')).toBe(false);
    expect(pane().getAttribute('aria-describedby')).not.toBeNull();
  });

  it('respeita aria-label/aria-labelledby definidos por quem abriu', () => {
    dialogs.open(Content, { ariaLabel: 'Meu rótulo' });
    expect(pane().getAttribute('aria-label')).toBe('Meu rótulo');
    expect(pane().hasAttribute('aria-labelledby')).toBe(false);
  });

  it('modal por padrão: não fecha por clique fora, fecha com Esc e devolve o foco', async () => {
    const ref = dialogs.open(Content);
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(ref.isOpen()).toBe(true);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await ref.closed;
    expect(ref.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('abre um TemplateRef com o shy-dialog dentro', async () => {
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.detectChanges();
    const ref = dialogs.open<unknown, unknown, number>(fixture.componentInstance.tpl());
    expect(pane().querySelector('h2')?.textContent).toBe('Do template');
    expect(pane().getAttribute('aria-labelledby')).toBe(pane().querySelector('h2')!.id);
    (pane().querySelector('#in-tpl') as HTMLButtonElement).click();
    expect(await ref.closed).toBe(1);

    const other = dialogs.open<unknown, unknown, number>(fixture.componentInstance.tpl());
    (pane().querySelector('.close') as HTMLButtonElement).click();
    expect(await other.closed).toBe(2);
  });

  describe('confirm e alert', () => {
    it('confirm: alertdialog com título e mensagem, foco em Cancelar, não fecha por clique fora', async () => {
      const result = dialogs.confirm({ title: 'Excluir?', message: 'Sem volta.', confirmLabel: 'Excluir', intent: 'danger' });
      const dialog = pane();

      expect(dialog.getAttribute('role')).toBe('alertdialog');
      expect(dialog.querySelector('h2')?.textContent).toBe('Excluir?');
      expect(dialog.textContent).toContain('Sem volta.');
      expect(dialog.querySelector('.close')).toBeNull();
      expect(document.activeElement?.textContent?.trim()).toBe('Cancel');

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      expect(document.querySelector('.shy-overlay-pane')).not.toBeNull();

      const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('.footer button'));
      expect(buttons.map((b) => b.textContent?.trim())).toEqual(['Cancel', 'Excluir']);
      expect(buttons[1].getAttribute('data-intent')).toBe('danger');
      buttons[1].click();
      expect(await result).toBe(true);
    });

    it('confirm: Cancelar e Esc resolvem false', async () => {
      const cancel = dialogs.confirm({ title: 'a', message: 'b', cancelLabel: 'Não' });
      (pane().querySelector('.footer button') as HTMLButtonElement).click();
      expect(await cancel).toBe(false);

      const esc = dialogs.confirm({ title: 'a', message: 'b' });
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      expect(await esc).toBe(false);
    });

    it('alert: um botão OK focado; resolve ao fechar', async () => {
      const done = dialogs.alert({ title: 'Salvo', message: 'Tudo certo.', okLabel: 'Beleza' });
      const buttons = pane().querySelectorAll('.footer button');
      expect(buttons).toHaveLength(1);
      expect(document.activeElement?.textContent?.trim()).toBe('Beleza');
      (buttons[0] as HTMLButtonElement).click();
      await expect(done).resolves.toBeUndefined();
    });
  });

  describe('DrawerService', () => {
    let drawers: DrawerService;
    beforeEach(() => (drawers = TestBed.inject(DrawerService)));

    it('abre na camada drawer, com a classe do lado (padrão end) e o título ligado', () => {
      drawers.open(DrawerContent);
      const dialog = pane();
      expect(dialog.tagName).toBe('DIALOG');
      expect(dialog.dataset['layer']).toBe('drawer');
      expect(dialog.classList.contains('shy-drawer-pane')).toBe(true);
      expect(dialog.classList.contains('shy-drawer-pane--end')).toBe(true);
      expect(dialog.getAttribute('aria-labelledby')).toBe(dialog.querySelector('h2')!.id);
    });

    it.each(['start', 'end', 'top', 'bottom'] as const)('lado %s vira classe no painel', (side) => {
      drawers.open(DrawerContent, { side, paneClass: 'extra' });
      expect(pane().classList.contains(`shy-drawer-pane--${side}`)).toBe(true);
      expect(pane().classList.contains('extra')).toBe(true);
    });

    it('fecha ao clicar no fundo por padrão (e pode desligar)', async () => {
      const ref = drawers.open(DrawerContent);
      vi.spyOn(ref.pane, 'getBoundingClientRect').mockReturnValue({ left: 700, right: 1000, top: 0, bottom: 800, width: 300, height: 800 } as DOMRect);
      ref.pane.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 }));
      await ref.closed;
      expect(ref.isOpen()).toBe(false);

      const sticky = drawers.open(DrawerContent, { closeOnOutsideClick: false });
      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      expect(sticky.isOpen()).toBe(true);
    });

    it('o botão de fechar do shy-drawer fecha o painel', async () => {
      const ref = drawers.open<DrawerContent, unknown, string>(DrawerContent);
      (pane().querySelector('.close') as HTMLButtonElement).click();
      expect(await ref.closed).toBeUndefined();
    });
  });
});
