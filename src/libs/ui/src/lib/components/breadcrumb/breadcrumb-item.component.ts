import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Item do `shy-breadcrumb`. Projete o link (`<a href>`, `<a routerLink>`) ou, na página atual, só o texto com `current`.
 * O separador é desenhado em CSS (`--shy-breadcrumb-separator`) e não entra na árvore de acessibilidade.
 */
@Component({
  selector: 'shy-breadcrumb-item',
  exportAs: 'shyBreadcrumbItem',
  template: '<span class="content" [attr.aria-current]="current() ? \'page\' : null"><ng-content /></span>',
  styleUrl: './breadcrumb-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[attr.data-current]': 'current() ? "" : null',
  },
})
export class BreadcrumbItemComponent {
  readonly current = input(false, { transform: booleanAttribute });
}
