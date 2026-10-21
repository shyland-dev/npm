import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

@Component({
  imports: [PaginationComponent],
  template: `<shy-pagination label="Resultados" [pageCount]="count()" [(page)]="page" [siblings]="siblings()" [disabled]="disabled()" />`,
})
class Host {
  count = signal(10);
  page = signal(1);
  siblings = signal(1);
  disabled = signal(false);
}

describe('PaginationComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    /** Texto de cada item da lista: números e "…". */
    const shape = () =>
      Array.from(el.querySelectorAll('li'))
        .slice(1, -1)
        .map((li) => li.textContent!.trim());
    return { fixture, host: fixture.componentInstance, el, buttons, shape };
  }

  it('nav nomeada, página atual com aria-current e nomes acessíveis', () => {
    const { el, buttons } = render();
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Resultados');
    const current = el.querySelectorAll('[aria-current]');
    expect(current.length).toBe(1);
    expect(current[0].textContent!.trim()).toBe('1');
    expect(current[0].getAttribute('aria-label')).toBe('Page 1');
    expect(buttons()[0].getAttribute('aria-label')).toBe('Previous page');
    expect(buttons()[buttons().length - 1].getAttribute('aria-label')).toBe('Next page');
  });

  it('janela com reticências: início, meio e fim', () => {
    const { fixture, host, shape } = render();
    expect(shape()).toEqual(['1', '2', '…', '10']);
    host.page.set(5);
    fixture.detectChanges();
    expect(shape()).toEqual(['1', '…', '4', '5', '6', '…', '10']);
    host.page.set(10);
    fixture.detectChanges();
    expect(shape()).toEqual(['1', '…', '9', '10']);
  });

  it('lacuna de uma página mostra a página em vez de reticências', () => {
    const { fixture, host, shape } = render();
    host.page.set(4);
    fixture.detectChanges();
    expect(shape()).toEqual(['1', '2', '3', '4', '5', '…', '10']);
  });

  it('anterior/próximo e clique atualizam [(page)]; as pontas desabilitam', () => {
    const { fixture, host, buttons } = render();
    expect(buttons()[0].disabled).toBe(true);
    buttons()[buttons().length - 1].click();
    fixture.detectChanges();
    expect(host.page()).toBe(2);
    buttons()[0].click();
    fixture.detectChanges();
    expect(host.page()).toBe(1);
    host.page.set(10);
    fixture.detectChanges();
    expect(buttons()[buttons().length - 1].disabled).toBe(true);
    buttons()
      .find((b) => b.textContent!.trim() === '9')!
      .click();
    fixture.detectChanges();
    expect(host.page()).toBe(9);
  });

  it('desabilitado bloqueia tudo; sem páginas não renderiza o nav', () => {
    const { fixture, host, el, buttons } = render();
    host.disabled.set(true);
    fixture.detectChanges();
    expect(buttons().every((b) => b.disabled)).toBe(true);
    host.count.set(0);
    fixture.detectChanges();
    expect(el.querySelector('nav')).toBeNull();
  });
});
