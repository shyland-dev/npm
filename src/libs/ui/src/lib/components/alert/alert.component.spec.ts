import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyAlertIntent } from '../../types/alert/alert.type';
import { AlertComponent } from './alert.component';

@Component({
  imports: [AlertComponent],
  template: `
    <shy-alert [intent]="intent()" [urgent]="urgent()" heading="Falha ao salvar" [dismissible]="true" dismissLabel="Fechar" (dismissed)="dismissed = dismissed + 1">
      Tente de novo.
      <button slot="action" type="button">Tentar</button>
    </shy-alert>
  `,
})
class Host {
  readonly intent = signal<ShyAlertIntent>('danger');
  readonly urgent = signal(false);
  dismissed = 0;
}

describe('AlertComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('shy-alert') as HTMLElement;
    const set = (change: () => void) => {
      change();
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, alert, set };
  }

  it('mostra ícone, título, texto e ação; o ícone é decorativo', () => {
    const { alert } = render();
    expect(alert.querySelector('.icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(alert.querySelector('.title')?.textContent).toBe('Falha ao salvar');
    expect(alert.querySelector('.message')?.textContent).toContain('Tente de novo.');
    expect(alert.querySelector('.action button')).not.toBeNull();
  });

  it('role="status" por padrão, mesmo em danger', () => {
    const { alert } = render();
    expect(alert.getAttribute('role')).toBe('status');
  });

  it('urgent vira role="alert" só em danger e warning', () => {
    const { host, alert, set } = render();
    set(() => host.urgent.set(true));
    expect(alert.getAttribute('role')).toBe('alert');
    set(() => host.intent.set('warning'));
    expect(alert.getAttribute('role')).toBe('alert');
    set(() => host.intent.set('info'));
    expect(alert.getAttribute('role')).toBe('status');
    set(() => host.intent.set('success'));
    expect(alert.getAttribute('role')).toBe('status');
  });

  it('o ícone muda com a intenção (não depende só da cor)', () => {
    const { host, alert, set } = render();
    const icons = new Set<string>();
    for (const intent of ['info', 'success', 'warning', 'danger'] as const) {
      set(() => host.intent.set(intent));
      icons.add(alert.querySelector('.icon svg')?.outerHTML ?? '');
    }
    expect(icons.size).toBe(4);
  });

  it('dismissible: o botão tem nome, oculta o alerta e emite dismissed', () => {
    const { fixture, host, alert } = render();
    const close = alert.querySelector('.close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Fechar');
    close.click();
    fixture.detectChanges();
    expect(alert.hasAttribute('hidden')).toBe(true);
    expect(host.dismissed).toBe(1);
  });
});
