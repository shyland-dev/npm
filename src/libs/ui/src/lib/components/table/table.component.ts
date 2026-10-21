import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChildren, input, model, output } from '@angular/core';
import { ShySortDirection, ShyTableSort } from '../../types/table/table.type';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { TableColumnComponent } from './table-column.component';
import { TableSortComponent } from './table-sort.component';

/**
 * Tabela de dados, em dois modos.
 *
 * **Declarativo** (`[rows]`): descreva as colunas e a lib monta a `<table>` nativa, com ordenação, seleção, paginação e estado vazio.
 * ```html
 * <shy-table [rows]="faturas" rowKey="id" label="Faturas" selectable [(selection)]="marcadas" [pageSize]="10">
 *   <shy-column key="cliente" header="Cliente" sortable />
 *   <shy-column key="total" header="Total" sortable numeric />
 * </shy-table>
 * ```
 * - `rowKey`: propriedade (ou função) que identifica a linha; vale para `selection`. Padrão: a própria linha.
 * - `sort` (`{ key, direction }`) e `page` são `model()`: leia/controle por `[(sort)]` e `[(page)]`. `pageSize` 0 = sem paginação.
 * - `serverSide`: a lib não ordena nem fatia; reaja a `(sortChange)`/`(pageChange)`, passe só as linhas da página em `rows` e o total em `totalRows`.
 * - Sem virtualização: para milhares de linhas, pagine.
 *
 * **Nativo** (sem `[rows]`): você escreve a `<table>` e o `shy-table` só estiliza e contém a rolagem
 * (`caption`, `thead`/`tbody`, `th scope`; `th shySort`; `data-numeric`, `data-narrow`, `data-selected`). Use quando precisar de `colspan`, linhas agrupadas ou células muito custom.
 *
 * Com `label` a área rolável é uma região nomeada e focável pelo teclado.
 */
@Component({
  selector: 'shy-table',
  exportAs: 'shyTable',
  imports: [NgTemplateOutlet, CheckboxComponent, EmptyStateComponent, PaginationComponent, TableSortComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-striped]': 'striped() ? "" : null',
    '[attr.data-dense]': 'dense() ? "" : null',
  },
})
export class TableComponent<T = unknown> {
  /** Linhas (modo declarativo). Sem este input, o conteúdo projetado (`<table>`) é usado. */
  readonly rows = input<readonly T[]>();
  readonly rowKey = input<string | ((row: T) => unknown)>();
  /** Nome acessível da região rolável. */
  readonly label = input<string>();
  /** Legenda visível da tabela (`<caption>`, modo declarativo). */
  readonly caption = input<string>();
  /** Linhas alternadas. */
  readonly striped = input(false, { transform: booleanAttribute });
  /** Células mais compactas. */
  readonly dense = input(false, { transform: booleanAttribute });

  readonly selectable = input(false, { transform: booleanAttribute });
  /** Chaves (`rowKey`) das linhas marcadas. */
  readonly selection = model<readonly unknown[]>([]);
  readonly sort = model<ShyTableSort | null>(null);
  /** Linhas por página; `0` desliga a paginação. */
  readonly pageSize = input(0);
  /** Página atual, 1-based. */
  readonly page = model(1);
  /** Ordenação e paginação ficam por sua conta (ex.: no servidor). */
  readonly serverSide = input(false, { transform: booleanAttribute });
  /** Total de linhas (com `serverSide`, onde `rows` traz só a página). */
  readonly totalRows = input<number>();

  readonly emptyHeading = input('No results');
  readonly emptyDescription = input<string>();
  readonly emptyIcon = input<string>('inbox');
  readonly selectAllLabel = input('Select all rows on this page');
  readonly selectRowLabel = input('Select row');
  readonly paginationLabel = input('Pagination');

  /** Emitido quando a seleção muda por ação do usuário. */
  readonly selectionChange = output<readonly unknown[]>();

  protected readonly columns = contentChildren(TableColumnComponent);
  protected readonly declarative = computed(() => this.rows() !== undefined);
  protected readonly colspan = computed(() => this.columns().length + (this.selectable() ? 1 : 0));

  private readonly sortedRows = computed(() => {
    const rows = this.rows() ?? [];
    const sort = this.sort();
    if (this.serverSide() || !sort) return rows;
    const column = this.columns().find((c) => c.key() === sort.key);
    const compare = column?.compare() ?? naturalCompare;
    const sign = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const [x, y] = [this.cellValue(a, sort.key), this.cellValue(b, sort.key)];
      if (isBlank(x) || isBlank(y)) return isBlank(x) === isBlank(y) ? 0 : isBlank(x) ? 1 : -1;
      return compare(x, y) * sign;
    });
  });

  protected readonly pageCount = computed(() => {
    const size = this.pageSize();
    if (size <= 0) return 1;
    return Math.max(1, Math.ceil((this.serverSide() ? (this.totalRows() ?? this.rows()?.length ?? 0) : this.sortedRows().length) / size));
  });
  protected readonly currentPage = computed(() => Math.min(Math.max(this.page(), 1), this.pageCount()));
  protected readonly visibleRows = computed(() => {
    const size = this.pageSize();
    const rows = this.sortedRows();
    if (size <= 0 || this.serverSide()) return rows;
    return rows.slice((this.currentPage() - 1) * size, this.currentPage() * size);
  });

  protected readonly allSelected = computed(() => this.visibleRows().length > 0 && this.visibleRows().every((row) => this.isSelected(row)));
  protected readonly someSelected = computed(() => !this.allSelected() && this.visibleRows().some((row) => this.isSelected(row)));

  protected keyOf(row: T): unknown {
    const key = this.rowKey();
    if (typeof key === 'function') return key(row);
    return key ? this.cellValue(row, key) : row;
  }

  protected cellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  protected isSelected(row: T): boolean {
    return this.selection().includes(this.keyOf(row));
  }

  protected directionOf(key: string): ShySortDirection {
    const sort = this.sort();
    return sort?.key === key ? sort.direction : null;
  }

  protected setSort(key: string, direction: ShySortDirection): void {
    this.sort.set(direction ? { key, direction } : null);
    this.page.set(1);
  }

  protected toggleRow(row: T, checked: boolean): void {
    const key = this.keyOf(row);
    this.setSelection(checked ? [...this.selection().filter((k) => k !== key), key] : this.selection().filter((k) => k !== key));
  }

  protected toggleAll(checked: boolean): void {
    const keys = this.visibleRows().map((row) => this.keyOf(row));
    this.setSelection(checked ? [...this.selection().filter((k) => !keys.includes(k)), ...keys] : this.selection().filter((k) => !keys.includes(k)));
  }

  private setSelection(selection: readonly unknown[]): void {
    this.selection.set(selection);
    this.selectionChange.emit(selection);
  }
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function naturalCompare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}
