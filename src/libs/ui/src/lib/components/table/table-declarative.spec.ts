import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShyTableSort } from '../../types/table/table.type';
import { TableColumnComponent, TableCellDirective } from './table-column.component';
import { TableComponent } from './table.component';

interface Row {
  id: number;
  name: string;
  total: number | null;
}

@Component({
  imports: [TableComponent, TableColumnComponent, TableCellDirective],
  template: `
    <shy-table [rows]="rows()" rowKey="id" label="Faturas" caption="Lista" selectable [(selection)]="selection" [(sort)]="sort" [pageSize]="pageSize()" [(page)]="page" emptyHeading="Nada" [serverSide]="serverSide()" [totalRows]="totalRows()">
      <shy-column key="name" header="Nome" sortable rowHeader />
      <shy-column key="total" sortable numeric>
        <ng-template shyCell let-row let-value="value">R$ {{ value }} ({{ row.name }})</ng-template>
      </shy-column>
    </shy-table>
  `,
})
class Host {
  readonly rows = signal<Row[]>([
    { id: 1, name: 'Bia', total: 30 },
    { id: 2, name: 'Ana', total: 100 },
    { id: 3, name: 'Caio', total: null },
    { id: 4, name: 'Dani', total: 5 },
  ]);
  readonly selection = signal<readonly unknown[]>([]);
  readonly sort = signal<ShyTableSort | null>(null);
  readonly pageSize = signal(0);
  readonly page = signal(1);
  readonly serverSide = signal(false);
  readonly totalRows = signal<number | undefined>(undefined);
}

describe('TableComponent (declarativo)', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const names = () => Array.from(el.querySelectorAll('tbody tr th[scope=row]')).map((th) => th.textContent?.trim());
    return { fixture, host: fixture.componentInstance, el, names };
  }

  it('monta cabeçalho, caption e linhas; th scope=row na coluna rowHeader; célula custom recebe row e value', () => {
    const { el, names } = render();
    expect(el.querySelector('caption')?.textContent?.trim()).toBe('Lista');
    expect(Array.from(el.querySelectorAll('thead th')).map((th) => th.textContent?.trim())).toEqual(['', 'Nome', 'total']);
    expect(names()).toEqual(['Bia', 'Ana', 'Caio', 'Dani']);
    expect(el.querySelector('tbody tr td[data-numeric]')?.textContent?.trim()).toBe('R$ 30 (Bia)');
    expect(el.querySelector('.scroll')?.getAttribute('role')).toBe('region');
  });

  it('ordena por texto e por número (vazios no fim, sempre) e reflete aria-sort', () => {
    const { fixture, host, el, names } = render();
    const [byName, byTotal] = Array.from(el.querySelectorAll('thead th button')) as HTMLButtonElement[];
    byName.click();
    fixture.detectChanges();
    expect(names()).toEqual(['Ana', 'Bia', 'Caio', 'Dani']);
    expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
    expect(el.querySelectorAll('thead th')[1].getAttribute('aria-sort')).toBe('ascending');

    byTotal.click();
    fixture.detectChanges();
    expect(names()).toEqual(['Dani', 'Bia', 'Ana', 'Caio']);
    byTotal.click();
    fixture.detectChanges();
    expect(names()).toEqual(['Ana', 'Bia', 'Dani', 'Caio']);
    expect(el.querySelectorAll('thead th')[1].hasAttribute('aria-sort')).toBe(false);
    byTotal.click();
    fixture.detectChanges();
    expect(host.sort()).toBeNull();
    expect(names()).toEqual(['Bia', 'Ana', 'Caio', 'Dani']);
  });

  it('seleciona linhas por rowKey, com "selecionar tudo" e indeterminate', () => {
    const { fixture, host, el } = render();
    const boxes = () => Array.from(el.querySelectorAll('shy-checkbox input')) as HTMLInputElement[];
    boxes()[2].click();
    fixture.detectChanges();
    expect(host.selection()).toEqual([2]);
    expect(el.querySelectorAll('tbody tr')[1].hasAttribute('data-selected')).toBe(true);
    expect(boxes()[0].indeterminate).toBe(true);

    boxes()[0].click();
    fixture.detectChanges();
    expect(host.selection()).toHaveLength(4);
    boxes()[0].click();
    fixture.detectChanges();
    expect(host.selection()).toEqual([]);
  });

  it('pagina e volta à página 1 ao ordenar', () => {
    const { fixture, host, el, names } = render();
    host.pageSize.set(3);
    fixture.detectChanges();
    expect(names()).toEqual(['Bia', 'Ana', 'Caio']);
    const next = el.querySelector('shy-pagination button[aria-label="Next page"]') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(host.page()).toBe(2);
    expect(names()).toEqual(['Dani']);
    (el.querySelector('thead th button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.page()).toBe(1);
  });

  it('sem linhas mostra o estado vazio dentro da tabela', () => {
    const { fixture, host, el } = render();
    host.rows.set([]);
    fixture.detectChanges();
    expect(el.querySelector('tbody td[colspan="3"] shy-empty-state .title')?.textContent).toBe('Nada');
  });

  it('serverSide não ordena nem fatia: só emite o modelo e usa totalRows', () => {
    const { fixture, host, el, names } = render();
    host.serverSide.set(true);
    host.pageSize.set(2);
    host.totalRows.set(10);
    fixture.detectChanges();
    expect(names()).toEqual(['Bia', 'Ana', 'Caio', 'Dani']);
    expect(el.querySelectorAll('shy-pagination button[aria-label^="Page"]').length).toBeGreaterThan(0);
    (el.querySelector('thead th button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
    expect(names()).toEqual(['Bia', 'Ana', 'Caio', 'Dani']);
  });
});
