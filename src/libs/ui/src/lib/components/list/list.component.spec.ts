import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ListItemComponent } from './list-item.component';
import { ListComponent } from './list.component';

@Component({
  imports: [ListComponent, ListItemComponent],
  template: `
    <shy-list aria-label="Contatos">
      <shy-list-item><i slot="start">A</i>Ana<span slot="secondary">ana@x.dev</span><b slot="end">hoje</b></shy-list-item>
      <shy-list-item href="/bia" selected>Bia</shy-list-item>
      <shy-list-item interactive (activated)="hits = hits + 1">Caio</shy-list-item>
      <shy-list-item interactive disabled (activated)="hits = hits + 10">Dani</shy-list-item>
    </shy-list>
  `,
})
class Host {
  hits = 0;
}

describe('ListComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, el, items: Array.from(el.querySelectorAll('shy-list-item')) as HTMLElement[] };
  }

  it('usa semântica de lista', () => {
    const { el, items } = render();
    expect(el.querySelector('shy-list')?.getAttribute('role')).toBe('list');
    expect(items.every((item) => item.getAttribute('role') === 'listitem')).toBe(true);
  });

  it('linha estática: sem link nem botão; slots nos lugares', () => {
    const { items } = render();
    expect(items[0].querySelector('a, button')).toBeNull();
    expect(items[0].querySelector('.start')?.textContent).toBe('A');
    expect(items[0].querySelector('.secondary')?.textContent).toBe('ana@x.dev');
    expect(items[0].querySelector('.end')?.textContent).toBe('hoje');
  });

  it('href vira link nativo e selected marca aria-current', () => {
    const { items } = render();
    const link = items[1].querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/bia');
    expect(link.getAttribute('aria-current')).toBe('true');
    expect(items[1].hasAttribute('data-selected')).toBe(true);
  });

  it('interactive vira botão que emite activated; disabled não emite', () => {
    const { fixture, host, items } = render();
    const [ok, off] = [items[2].querySelector('button')!, items[3].querySelector('button')!];
    expect(ok.type).toBe('button');
    ok.click();
    off.click();
    fixture.detectChanges();
    expect(off.disabled).toBe(true);
    expect(host.hits).toBe(1);
  });
});
