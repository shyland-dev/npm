import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

@Component({
  imports: [BadgeComponent],
  template: `
    <shy-badge intent="success" variant="solid" size="sm">Pago</shy-badge>
    <shy-badge [count]="count()" [max]="99" />
    <shy-badge [dot]="true" label="Online" />
    <shy-badge [removable]="true" removeLabel="Remover tag" (removed)="removed = removed + 1">tag</shy-badge>
  `,
})
class Host {
  readonly count = signal(5);
  removed = 0;
}

describe('BadgeComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const badges = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('shy-badge')) as HTMLElement[];
    return { fixture, host: fixture.componentInstance, badges };
  }

  it('reflete intent, variant e size; o padrão é neutral/soft/md', () => {
    const { badges } = render();
    expect(badges[0].dataset['intent']).toBe('success');
    expect(badges[0].dataset['variant']).toBe('solid');
    expect(badges[0].dataset['size']).toBe('sm');
    expect(badges[1].dataset['intent']).toBe('neutral');
    expect(badges[1].dataset['variant']).toBe('soft');
    expect(badges[1].dataset['size']).toBe('md');
  });

  it('contador limita em max+', () => {
    const { fixture, host, badges } = render();
    expect(badges[1].textContent?.trim()).toBe('5');
    host.count.set(150);
    fixture.detectChanges();
    expect(badges[1].textContent?.trim()).toBe('99+');
  });

  it('só ponto com label vira img com nome; com texto não tem role', () => {
    const { badges } = render();
    expect(badges[2].getAttribute('role')).toBe('img');
    expect(badges[2].getAttribute('aria-label')).toBe('Online');
    expect(badges[2].querySelector('.dot')?.getAttribute('aria-hidden')).toBe('true');
    expect(badges[0].hasAttribute('role')).toBe(false);
  });

  it('removable: botão com nome acessível que emite removed', () => {
    const { fixture, host, badges } = render();
    const button = badges[3].querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Remover tag');
    button.click();
    fixture.detectChanges();
    expect(host.removed).toBe(1);
    expect(badges[0].querySelector('button')).toBeNull();
  });
});
