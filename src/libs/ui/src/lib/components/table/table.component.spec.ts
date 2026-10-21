import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShySortDirection } from '../../types/table/table.type';
import { TableSortComponent } from './table-sort.component';
import { TableComponent } from './table.component';

@Component({
  imports: [TableComponent, TableSortComponent],
  template: `
    <shy-table label="Faturas" striped dense>
      <table>
        <caption>
          Faturas
        </caption>
        <thead>
          <tr>
            <th scope="col" shySort [(direction)]="name">Nome</th>
            <th scope="col" shySort [(direction)]="total">Total</th>
            <th scope="col">Sem ordenação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A</td>
            <td data-numeric>1</td>
            <td>x</td>
          </tr>
        </tbody>
      </table>
    </shy-table>
    <shy-table><table></table></shy-table>
  `,
})
class Host {
  readonly name = signal<ShySortDirection>(null);
  readonly total = signal<ShySortDirection>('desc');
}

describe('TableComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tables = Array.from(el.querySelectorAll('shy-table')) as HTMLElement[];
    const headers = Array.from(el.querySelectorAll('th')) as HTMLElement[];
    return { fixture, host: fixture.componentInstance, tables, headers };
  }

  it('a região rolável é focável e nomeada só com label', () => {
    const { tables } = render();
    const [named, unnamed] = tables.map((t) => t.querySelector('.scroll') as HTMLElement);
    expect(named.getAttribute('role')).toBe('region');
    expect(named.getAttribute('aria-label')).toBe('Faturas');
    expect(named.tabIndex).toBe(0);
    expect(unnamed.hasAttribute('role')).toBe(false);
    expect(tables[0].hasAttribute('data-striped')).toBe(true);
    expect(tables[0].hasAttribute('data-dense')).toBe(true);
    expect(tables[1].hasAttribute('data-striped')).toBe(false);
  });

  it('mantém a <table> nativa projetada', () => {
    const { tables } = render();
    expect(tables[0].querySelector('.scroll > table > caption')).not.toBeNull();
  });

  it('aria-sort só na coluna ordenada', () => {
    const { headers } = render();
    expect(headers[0].hasAttribute('aria-sort')).toBe(false);
    expect(headers[1].getAttribute('aria-sort')).toBe('descending');
    expect(headers[2].hasAttribute('aria-sort')).toBe(false);
    expect(headers[2].querySelector('button')).toBeNull();
  });

  it('o botão do cabeçalho alterna asc → desc → nenhuma e atualiza o modelo', () => {
    const { fixture, host, headers } = render();
    const button = headers[0].querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.textContent).toContain('Nome');

    button.click();
    fixture.detectChanges();
    expect(host.name()).toBe('asc');
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');

    button.click();
    fixture.detectChanges();
    expect(host.name()).toBe('desc');
    expect(headers[0].getAttribute('aria-sort')).toBe('descending');

    button.click();
    fixture.detectChanges();
    expect(host.name()).toBeNull();
    expect(headers[0].hasAttribute('aria-sort')).toBe(false);
  });
});
