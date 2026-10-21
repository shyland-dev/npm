import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyButtonLoadingPosition } from '../../types/button/button.type';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <form (submit)="submitted = submitted + 1; $event.preventDefault()">
      <button shyButton type="submit" [variant]="'outline'" [intent]="'danger'" [size]="'lg'" [loading]="loading()" [loadingPosition]="position()" [loadingText]="loadingText()" [disabled]="disabled()" (click)="clicks = clicks + 1">
        <span slot="start" class="icon-start">*</span>
        Salvar
      </button>
    </form>
    <a shyButton href="#destino" [disabled]="disabled()" (click)="linkClicks = linkClicks + 1">Link</a>
  `,
})
class Host {
  readonly loading = signal(false);
  readonly position = signal<ShyButtonLoadingPosition>('replace');
  readonly loadingText = signal<string | undefined>(undefined);
  readonly disabled = signal(false);
  clicks = 0;
  linkClicks = 0;
  submitted = 0;
}

describe('ButtonComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      button: el.querySelector('button') as HTMLButtonElement,
      link: el.querySelector('a') as HTMLAnchorElement,
      set(change: () => void) {
        change();
        fixture.detectChanges();
      },
    };
  }

  it('reflete variant, intent e size em data-* e mantém o elemento nativo', () => {
    const { button, link } = render();

    expect(button.dataset['variant']).toBe('outline');
    expect(button.dataset['intent']).toBe('danger');
    expect(button.dataset['size']).toBe('lg');
    expect(button.type).toBe('submit');
    expect(link.dataset['variant']).toBe('solid');
    expect(link.getAttribute('href')).toBe('#destino');
  });

  it('padrão sem loading: sem aria-busy, sem aria-disabled, clique e submit funcionam', () => {
    const { host, button } = render();

    expect(button.hasAttribute('aria-busy')).toBe(false);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
    button.click();
    expect(host.clicks).toBe(1);
    expect(host.submitted).toBe(1);
  });

  it('loading: aria-busy + aria-disabled, ignora clique e submit, mas continua focável', () => {
    const { host, button, set } = render();
    set(() => host.loading.set(true));

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);

    button.focus();
    button.click();
    expect(document.activeElement).toBe(button);
    expect(host.clicks).toBe(0);
    expect(host.submitted).toBe(0);
  });

  it('replace: spinner por cima, conteúdo continua no DOM (largura e nome acessível preservados)', () => {
    const { host, button, set } = render();
    set(() => host.loading.set(true));

    expect(button.dataset['loading']).toBe('replace');
    const spinner = button.querySelector('.overlay .spinner');
    expect(spinner?.tagName.toLowerCase()).toBe('shy-spinner');
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');
    expect(spinner?.hasAttribute('role')).toBe(false);
    expect(button.querySelector('.text')?.textContent?.trim()).toBe('Salvar');
    expect(button.querySelector('.text')?.classList.contains('is-hidden')).toBe(false);
  });

  it('start: spinner na ponta inicial, junto do ícone projetado', () => {
    const { host, button, set } = render();
    set(() => {
      host.position.set('start');
      host.loading.set(true);
    });

    const start = button.querySelector('.start') as HTMLElement;
    expect(start.querySelector('.icon-start')).not.toBeNull();
    expect(start.querySelector('.spinner')).not.toBeNull();
    expect(button.querySelector('.overlay')).toBeNull();
  });

  it('end sem ícone: o spinner é acrescentado na ponta final', () => {
    const { host, button, set } = render();
    set(() => {
      host.position.set('end');
      host.loading.set(true);
    });

    expect(button.querySelector('.end .spinner')).not.toBeNull();
  });

  it('loadingText fica reservado (oculto) e troca com o rótulo só durante o loading', () => {
    const { host, button, set } = render();
    set(() => {
      host.position.set('start');
      host.loadingText.set('Salvando…');
    });

    const text = () => button.querySelector('.text') as HTMLElement;
    const loading = () => button.querySelector('.loading-text') as HTMLElement;
    expect(loading().classList.contains('is-hidden')).toBe(true);
    expect(loading().getAttribute('aria-hidden')).toBe('true');

    set(() => host.loading.set(true));
    expect(loading().classList.contains('is-hidden')).toBe(false);
    expect(loading().hasAttribute('aria-hidden')).toBe(false);
    expect(text().classList.contains('is-hidden')).toBe(true);
  });

  it('loadingText não aparece em replace', () => {
    const { host, button, set } = render();
    set(() => {
      host.loadingText.set('Salvando…');
      host.loading.set(true);
    });

    expect(button.querySelector('.loading-text')).toBeNull();
  });

  it('disabled: <button> recebe disabled nativo; <a> recebe aria-disabled e não navega', () => {
    const { host, button, link, set } = render();
    set(() => host.disabled.set(true));

    expect(button.disabled).toBe(true);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.hasAttribute('disabled')).toBe(false);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(host.linkClicks).toBe(0);
  });

  it('teclado: Space num <a shyButton> não dispara clique (sem handler de tecla próprio)', () => {
    const { host, link } = render();

    link.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    link.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    expect(host.linkClicks).toBe(0);
  });
});
