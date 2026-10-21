import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DividerComponent } from '../divider/divider.component';
import { OverlayService } from '../../overlay/overlay.service';
import { MenuItemComponent } from './menu-item.component';
import { MenuComponent } from './menu.component';
import { MenuDirective } from './menu.directive';

@Component({
  imports: [MenuDirective, MenuComponent, MenuItemComponent, DividerComponent],
  template: `
    <button id="trigger" [shyMenu]="tpl">Ações</button>
    <ng-template #tpl>
      <shy-menu>
        <button shyMenuItem id="edit" (click)="log.push('edit')">Editar</button>
        <button shyMenuItem id="copy" (click)="log.push('copy')">Copiar</button>
        <shy-divider />
        <button shyMenuItem id="off" disabled (click)="log.push('off')">Arquivar</button>
        <a shyMenuItem id="del" href="#x" (click)="log.push('del')">Excluir</a>
      </shy-menu>
    </ng-template>
  `,
})
class Host {
  log: string[] = [];
}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement | null;
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const active = () => document.activeElement?.id;

describe('MenuDirective / MenuComponent', () => {
  let fixture: ComponentFixture<Host>;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    document.body.append(fixture.nativeElement);
    fixture.detectChanges();
    trigger = fixture.nativeElement.querySelector('#trigger');
    trigger.focus();
  });

  afterEach(async () => {
    await TestBed.inject(OverlayService).closeAll(false);
    fixture.nativeElement.remove();
  });

  it('abre com role=menu nomeado pelo botão, aria-haspopup=menu e foco no primeiro item', () => {
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    trigger.click();
    fixture.detectChanges();

    const menu = pane()!.querySelector('[role="menu"]')!;
    expect(pane()!.dataset['layer']).toBe('dropdown');
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(active()).toBe('edit');
    expect(menu.querySelectorAll('[role="menuitem"]').length).toBe(4);
  });

  it('↓ no botão abre no primeiro item; ↑ abre no último', async () => {
    key(trigger, 'ArrowDown');
    expect(active()).toBe('edit');
    trigger.click();
    await tick();
    trigger.focus();

    key(trigger, 'ArrowUp');
    expect(active()).toBe('del');
  });

  it('setas, Home e End movem o foco com volta ao início/fim, incluindo o item desabilitado', () => {
    trigger.click();
    const menu = pane()!.querySelector('shy-menu')!;
    key(menu, 'ArrowDown');
    expect(active()).toBe('copy');
    key(menu, 'ArrowDown');
    expect(active()).toBe('off');
    key(menu, 'End');
    expect(active()).toBe('del');
    key(menu, 'ArrowDown');
    expect(active()).toBe('edit');
    key(menu, 'ArrowUp');
    expect(active()).toBe('del');
    key(menu, 'Home');
    expect(active()).toBe('edit');
  });

  it('typeahead pula para o item que começa com a letra', () => {
    trigger.click();
    const menu = pane()!.querySelector('shy-menu')!;
    const now = vi.spyOn(Date, 'now').mockReturnValue(1000);
    key(menu, 'e');
    expect(active()).toBe('del');
    now.mockReturnValue(2000);
    key(menu, 'c');
    expect(active()).toBe('copy');
    now.mockRestore();
  });

  it('item desabilitado usa aria-disabled, não executa e não fecha o menu', () => {
    trigger.click();
    const off = pane()!.querySelector<HTMLElement>('#off')!;
    expect(off.getAttribute('aria-disabled')).toBe('true');
    expect(off.getAttribute('tabindex')).toBe('-1');
    off.click();
    expect(fixture.componentInstance.log).toEqual([]);
    expect(pane()).not.toBeNull();
  });

  it('ativar um item executa a ação, fecha o menu e devolve o foco ao botão', async () => {
    trigger.click();
    pane()!.querySelector<HTMLElement>('#copy')!.click();
    await tick();
    expect(fixture.componentInstance.log).toEqual(['copy']);
    expect(pane()).toBeNull();
    expect(active()).toBe('trigger');
  });

  it('Esc fecha e devolve o foco; Tab fecha e fica no botão para seguir a ordem da página', async () => {
    trigger.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick();
    expect(pane()).toBeNull();
    expect(active()).toBe('trigger');

    trigger.click();
    key(pane()!.querySelector('#copy')!, 'Tab');
    await tick();
    expect(pane()).toBeNull();
    expect(active()).toBe('trigger');
  });
});
