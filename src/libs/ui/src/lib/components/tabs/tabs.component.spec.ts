import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <shy-tabs label="Conta" [(value)]="value" [activation]="activation()" [orientation]="orientation()">
      <shy-tab value="a" label="Perfil">Painel A</shy-tab>
      <shy-tab value="b" label="Senha" disabled>Painel B</shy-tab>
      <shy-tab value="c" label="Plano">Painel C</shy-tab>
      <shy-tab value="d" label="Faturas">Painel D</shy-tab>
    </shy-tabs>
  `,
})
class Host {
  value = signal<string | undefined>(undefined);
  activation = signal<'automatic' | 'manual'>('automatic');
  orientation = signal<'horizontal' | 'vertical'>('horizontal');
}

describe('TabsComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role=tab]'));
    const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role=tabpanel]'));
    const press = (target: HTMLElement, key: string) => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, el, buttons, panels, press };
  }

  it('semântica: tablist nomeada, tabs ligadas aos painéis, só o selecionado visível e no Tab', () => {
    const { el, buttons, panels } = render();
    const list = el.querySelector('[role=tablist]')!;
    expect(list.getAttribute('aria-label')).toBe('Conta');
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    // sem value: primeira aba habilitada
    expect(buttons().map((b) => b.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false', 'false']);
    expect(buttons().map((b) => b.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(panels().map((p) => p.hidden)).toEqual([false, true, true, true]);
    buttons().forEach((b, i) => {
      expect(b.getAttribute('aria-controls')).toBe(panels()[i].id);
      expect(panels()[i].getAttribute('aria-labelledby')).toBe(b.id);
    });
    expect(buttons()[1].disabled).toBe(true);
  });

  it('clique seleciona e atualiza [(value)]', () => {
    const { fixture, host, buttons, panels } = render();
    buttons()[2].click();
    fixture.detectChanges();
    expect(host.value()).toBe('c');
    expect(buttons()[2].getAttribute('aria-selected')).toBe('true');
    expect(panels()[2].hidden).toBe(false);
    expect(panels()[0].hidden).toBe(true);
  });

  it('automático: setas movem o foco, selecionam e pulam a aba desabilitada; dão a volta', () => {
    const { fixture, host, buttons, press } = render();
    buttons()[0].focus();
    press(buttons()[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[2]);
    expect(host.value()).toBe('c');
    press(buttons()[2], 'End');
    expect(document.activeElement).toBe(buttons()[3]);
    press(buttons()[3], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[0]);
    expect(host.value()).toBe('a');
    press(buttons()[0], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons()[3]);
    press(buttons()[3], 'Home');
    expect(document.activeElement).toBe(buttons()[0]);
    fixture.detectChanges();
    expect(buttons()[0].tabIndex).toBe(0);
  });

  it('manual: setas só movem o foco; o clique (Enter/Espaço) seleciona', () => {
    const { fixture, host, buttons, press } = render();
    host.activation.set('manual');
    fixture.detectChanges();
    buttons()[0].focus();
    press(buttons()[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[2]);
    expect(host.value()).toBeUndefined();
    buttons()[2].click();
    fixture.detectChanges();
    expect(host.value()).toBe('c');
  });

  it('vertical: ↓/↑ navegam e ←/→ não fazem nada', () => {
    const { fixture, host, buttons, press } = render();
    host.orientation.set('vertical');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=tablist]').getAttribute('aria-orientation')).toBe('vertical');
    buttons()[0].focus();
    press(buttons()[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons()[0]);
    press(buttons()[0], 'ArrowDown');
    expect(document.activeElement).toBe(buttons()[2]);
  });

  it('em RTL as setas horizontais se invertem', () => {
    const { buttons, press, el } = render();
    el.style.direction = 'rtl';
    buttons()[0].focus();
    press(buttons()[0], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons()[2]);
  });
});
