import { Component, computed, signal } from '@angular/core';
import { BadgeComponent, InputComponent, ShySortDirection, ShyTableSort, TableCellDirective, TableColumnComponent, TableComponent, TableSortComponent } from '@shyland-dev/ui';

interface Invoice {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending';
  total: number;
}

const INVOICES: Invoice[] = Array.from({ length: 23 }, (_, i) => ({
  id: `INV-${String(1001 + i)}`,
  customer: ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Rocha', 'Elisa Prado'][i % 5],
  status: i % 3 === 0 ? 'Pending' : 'Paid',
  total: 120 + ((i * 97) % 880),
}));

@Component({
  selector: 'app-table-page',
  imports: [TableComponent, TableColumnComponent, TableCellDirective, TableSortComponent, BadgeComponent, InputComponent],
  templateUrl: './table.html',
})
export class TablePage {
  protected readonly filter = signal('');
  protected readonly invoices = computed(() => INVOICES.filter((row) => row.customer.toLowerCase().includes(this.filter().toLowerCase())));
  protected readonly selection = signal<readonly unknown[]>([]);
  protected readonly sort = signal<ShyTableSort | null>({ key: 'total', direction: 'desc' });
  protected readonly page = signal(1);

  // Modo nativo: ordenação feita à mão sobre uma <table> escrita no HTML.
  protected readonly nativeSort = signal<ShySortDirection>(null);
  protected readonly team = computed(() => {
    const rows = [
      { name: 'Ana', role: 'Design', hours: 32 },
      { name: 'Bruno', role: 'Engineering', hours: 40 },
      { name: 'Carla', role: 'Product', hours: 28 },
    ];
    const dir = this.nativeSort();
    return dir ? [...rows].sort((a, b) => a.name.localeCompare(b.name) * (dir === 'asc' ? 1 : -1)) : rows;
  });
}
