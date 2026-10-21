import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  imports: [EmptyStateComponent],
  template: `
    <shy-empty-state heading="Nenhum projeto" icon="inbox">Crie o primeiro.<button slot="action">Novo</button></shy-empty-state>
    <shy-empty-state />
  `,
})
class Host {}

describe('EmptyStateComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const states = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('shy-empty-state')) as HTMLElement[];
    return { states };
  }

  it('mostra ícone, título, descrição e ação, sem role próprio', () => {
    const { states } = render();
    expect(states[0].querySelector('.title')?.textContent).toBe('Nenhum projeto');
    expect(states[0].querySelector('.description')?.textContent).toContain('Crie o primeiro.');
    expect(states[0].querySelector('.action button')).not.toBeNull();
    expect(states[0].querySelector('shy-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(states[0].hasAttribute('role')).toBe(false);
  });

  it('sem ícone nem título não renderiza esses blocos', () => {
    const { states } = render();
    expect(states[1].querySelector('shy-icon')).toBeNull();
    expect(states[1].querySelector('.title')).toBeNull();
  });
});
