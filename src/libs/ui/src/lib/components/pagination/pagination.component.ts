import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

interface PaginationEntry {
  key: string;
  /** Número da página, ou `null` para reticências. */
  page: number | null;
}

/**
 * Paginação: `<nav aria-label>` com botões nativos; a página atual leva `aria-current="page"`.
 * `[(page)]` é 1-based. Mostra as `boundaries` primeiras e últimas páginas, a atual com `siblings` de cada lado e reticências no resto
 * (uma lacuna de uma só página mostra a página em vez das reticências).
 * Os textos acessíveis são inputs para traduzir (`previousLabel`, `nextLabel`, `pageLabel`).
 */
@Component({
  selector: 'shy-pagination',
  exportAs: 'shyPagination',
  imports: [IconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class PaginationComponent {
  readonly page = model(1);
  readonly pageCount = input.required<number>();
  /** Páginas vizinhas da atual, de cada lado. */
  readonly siblings = input(1);
  /** Páginas fixas em cada ponta. */
  readonly boundaries = input(1);
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Nome acessível do `nav`. */
  readonly label = input('Pagination');
  readonly previousLabel = input('Previous page');
  readonly nextLabel = input('Next page');
  /** Prefixo do nome de cada botão de página: "Page 3". */
  readonly pageLabel = input('Page');

  protected readonly count = computed(() => Math.max(0, Math.floor(this.pageCount())));
  protected readonly current = computed(() => Math.min(Math.max(this.page(), 1), this.count()));

  protected readonly entries = computed<PaginationEntry[]>(() => {
    const count = this.count();
    const current = this.current();
    const siblings = Math.max(0, this.siblings());
    const boundaries = Math.max(0, this.boundaries());

    const shown = new Set<number>();
    const add = (from: number, to: number) => {
      for (let n = Math.max(from, 1); n <= Math.min(to, count); n++) shown.add(n);
    };
    add(1, boundaries);
    add(count - boundaries + 1, count);
    add(current - siblings, current + siblings);

    const entries: PaginationEntry[] = [];
    let previous = 0;
    for (const n of [...shown].sort((a, b) => a - b)) {
      if (n - previous === 2) entries.push({ key: `p${previous + 1}`, page: previous + 1 });
      else if (n - previous > 2) entries.push({ key: `gap${previous}`, page: null });
      entries.push({ key: `p${n}`, page: n });
      previous = n;
    }
    return entries;
  });

  protected go(page: number): void {
    if (this.disabled()) return;
    this.page.set(Math.min(Math.max(page, 1), this.count()));
  }
}
