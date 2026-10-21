import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayService } from '../../overlay/overlay.service';
import { PopoverComponent } from './popover.component';
import { PopoverDirective } from './popover.directive';

@Component({
  imports: [PopoverDirective, PopoverComponent],
  template: `
    <button id="before">antes</button>
    <button id="trigger" [shyPopover]="tpl" #pop="shyPopover">Abrir</button>
    <button id="after">depois</button>
    <ng-template #tpl>
      <shy-popover><input id="first" /><button id="last">ok</button></shy-popover>
    </ng-template>
  `,
})
class Host {}

const pane = () => document.querySelector('.shy-overlay-pane') as HTMLElement | null;
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('PopoverDirective', () => {
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

  it('o gatilho declara aria-haspopup, aria-expanded=false e abre ao clicar com aria-controls apontando o painel', () => {
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(pane()).not.toBeNull();
    expect(pane()!.dataset['layer']).toBe('popover');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(pane()!.id);
  });

  it('foca o primeiro focável ao abrir; segundo clique fecha e devolve o foco ao gatilho', async () => {
    trigger.click();
    expect(document.activeElement?.id).toBe('first');

    trigger.click();
    await tick();
    fixture.detectChanges();

    expect(pane()).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('Esc fecha e devolve o foco ao gatilho', async () => {
    trigger.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick();
    expect(pane()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('clique fora fecha; clique dentro não', async () => {
    trigger.click();
    pane()!
      .querySelector('#last')!
      .dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(pane()).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await tick();
    expect(pane()).toBeNull();
  });

  it('Tab no último focável fecha e deixa o foco no gatilho; Tab no meio não fecha', async () => {
    trigger.click();
    const last = pane()!.querySelector<HTMLElement>('#last')!;
    const first = pane()!.querySelector<HTMLElement>('#first')!;

    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(pane()).not.toBeNull();

    last.focus();
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    await tick();
    expect(pane()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('destruir o gatilho fecha o painel', async () => {
    trigger.click();
    fixture.destroy();
    await tick();
    expect(pane()).toBeNull();
  });
});
