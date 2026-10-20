import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconComponent } from '../icon/icon.component';
import { IconButtonComponent } from './icon-button.component';

@Component({
  imports: [IconButtonComponent, IconComponent],
  template: `<button shyIconButton type="button" [label]="label()" [size]="'sm'" [disabled]="disabled()" (click)="clicks = clicks + 1"><shy-icon>x-lg</shy-icon></button>`,
})
class Host {
  readonly label = signal('Fechar');
  readonly disabled = signal(false);
  clicks = 0;
}

describe('IconButtonComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, host: fixture.componentInstance, button: fixture.nativeElement.querySelector('button') as HTMLButtonElement };
  }

  it('label vira aria-label e o ícone fica decorativo', () => {
    const { button } = render();

    expect(button.getAttribute('aria-label')).toBe('Fechar');
    expect(button.querySelector('shy-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('padrões: ghost + neutral; size refletido', () => {
    const { button } = render();

    expect(button.dataset['variant']).toBe('ghost');
    expect(button.dataset['intent']).toBe('neutral');
    expect(button.dataset['size']).toBe('sm');
  });

  it('atualiza o nome acessível e respeita disabled nativo', () => {
    const { fixture, host, button } = render();
    host.label.set('Remover');
    host.disabled.set(true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Remover');
    expect(button.disabled).toBe(true);
    button.click();
    expect(host.clicks).toBe(0);
  });
});
