import { booleanAttribute, ChangeDetectionStrategy, Component, contentChild, Directive, input, TemplateRef, inject } from '@angular/core';
import { ShyTableCellContext } from '../../types/table/table.type';

/** Marca o `<ng-template>` que desenha a célula de uma `shy-column`: `<ng-template shyCell let-row let-value="value">`. */
@Directive({ selector: 'ng-template[shyCell]' })
export class TableCellDirective {
  readonly template = inject<TemplateRef<ShyTableCellContext>>(TemplateRef);
}

/**
 * Coluna do `shy-table` em modo declarativo (`[rows]`). Não renderiza nada: só descreve a coluna.
 *
 * `<shy-column key="total" header="Total" sortable numeric />`. Sem `<ng-template shyCell>` a célula mostra `row[key]`.
 * `rowHeader` faz da célula uma `th scope="row"` (a coluna que identifica a linha, ex.: nome ou código).
 * `compare` troca a comparação da ordenação interna (padrão: números e textos com ordem natural, vazios no fim).
 */
@Component({
  selector: 'shy-column',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { hidden: '' },
})
export class TableColumnComponent {
  /** Propriedade da linha exibida e identificador da coluna na ordenação. */
  readonly key = input.required<string>();
  /** Texto do cabeçalho (padrão: `key`). */
  readonly header = input<string>();
  readonly sortable = input(false, { transform: booleanAttribute });
  /** Alinha ao fim, com algarismos tabulares. */
  readonly numeric = input(false, { transform: booleanAttribute });
  readonly rowHeader = input(false, { transform: booleanAttribute });
  readonly compare = input<(a: unknown, b: unknown) => number>();

  readonly cell = contentChild(TableCellDirective);
}
