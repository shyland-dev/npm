import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `
    <shy-card [elevation]="2">
      <span slot="header">Título</span>
      Corpo
      <span slot="footer">Rodapé</span>
    </shy-card>
    <a shyCard href="#x">Link</a>
    <button shyCard type="button" (click)="clicks = clicks + 1">Botão</button>
  `,
})
class Host {
  clicks = 0;
}

describe('CardComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, card: el.querySelector('shy-card') as HTMLElement, link: el.querySelector('a') as HTMLElement, button: el.querySelector('button') as HTMLButtonElement };
  }

  it('projeta cabeçalho, corpo e rodapé nos slots', () => {
    const { card } = render();
    expect(card.querySelector('.header')?.textContent).toContain('Título');
    expect(card.querySelector('.body')?.textContent).toContain('Corpo');
    expect(card.querySelector('.footer')?.textContent).toContain('Rodapé');
    expect(card.dataset['elevation']).toBe('2');
  });

  it('shy-card não é interativo; a e button são', () => {
    const { card, link, button } = render();
    expect(card.hasAttribute('data-interactive')).toBe(false);
    expect(card.hasAttribute('tabindex')).toBe(false);
    expect(link.hasAttribute('data-interactive')).toBe(true);
    expect(button.hasAttribute('data-interactive')).toBe(true);
  });

  it('o botão-cartão dispara click nativo', () => {
    const { fixture, host, button } = render();
    button.click();
    fixture.detectChanges();
    expect(host.clicks).toBe(1);
  });
});
