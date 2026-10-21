import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShySpinnerVariant } from '../../types/spinner/spinner.type';
import { SpinnerComponent } from './spinner.component';

@Component({
  imports: [SpinnerComponent],
  template: `<shy-spinner [variant]="variant()" [size]="'lg'" [label]="label()" />`,
})
class Host {
  readonly variant = signal<ShySpinnerVariant>('ring');
  readonly label = signal<string | undefined>(undefined);
}

describe('SpinnerComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const spinner = (fixture.nativeElement as HTMLElement).querySelector('shy-spinner') as HTMLElement;
    return {
      host: fixture.componentInstance,
      spinner,
      set(change: () => void) {
        change();
        fixture.detectChanges();
      },
    };
  }

  it('sem label é decorativo: aria-hidden e sem role', () => {
    const { spinner } = render();

    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.hasAttribute('role')).toBe(false);
    expect(spinner.querySelector('.label')).toBeNull();
  });

  it('com label vira role="status" com o texto para leitor de tela', () => {
    const { host, spinner, set } = render();
    set(() => host.label.set('Carregando pedidos'));

    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.hasAttribute('aria-hidden')).toBe(false);
    expect(spinner.querySelector('.label')?.textContent).toBe('Carregando pedidos');
    expect(spinner.querySelector('.graphic')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('reflete variant e size em data-*', () => {
    const { spinner } = render();

    expect(spinner.dataset['variant']).toBe('ring');
    expect(spinner.dataset['size']).toBe('lg');
  });

  it.each<[ShySpinnerVariant, string, number]>([
    ['ring', '.arc', 1],
    ['ring-track', '.track', 1],
    ['dash', '.arc', 1],
    ['dots', '.dot', 3],
    ['bars', '.bar', 4],
    ['pulse', '.ping', 2],
    ['orbit', '.satellite', 1],
    ['breathe', '.core', 1],
  ])('variante %s desenha %s', (variant, selector, count) => {
    const { host, spinner, set } = render();
    set(() => host.variant.set(variant));

    expect(spinner.querySelectorAll(selector).length).toBe(count);
  });
});
