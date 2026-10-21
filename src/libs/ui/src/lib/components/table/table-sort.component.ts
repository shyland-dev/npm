import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { ShySortDirection } from '../../types/table/table.type';
import { IconComponent } from '../icon/icon.component';

/**
 * Cabeçalho de coluna ordenável: `<th shySort [(direction)]="dir">Nome</th>`.
 * O conteúdo vira um botão nativo; a `th` leva `aria-sort` (só enquanto ordenada). O clique alterna `asc` → `desc` → sem ordenação.
 * O componente só informa a direção: quem usa ordena os dados e zera `direction` nas outras colunas.
 */
@Component({
  selector: 'th[shySort]',
  imports: [IconComponent],
  templateUrl: './table-sort.component.html',
  styleUrl: './table-sort.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-sort]': 'ariaSort()',
    '[attr.data-sorted]': 'direction() ? "" : null',
  },
})
export class TableSortComponent {
  readonly direction = model<ShySortDirection>(null);

  protected readonly ariaSort = computed(() => (this.direction() === 'asc' ? 'ascending' : this.direction() === 'desc' ? 'descending' : null));
  protected readonly icon = computed(() => (this.direction() === 'asc' ? 'arrow-up-short' : this.direction() === 'desc' ? 'arrow-down-short' : 'arrow-down-up'));

  protected toggle(): void {
    this.direction.set(this.direction() === 'asc' ? 'desc' : this.direction() === 'desc' ? null : 'asc');
  }
}
