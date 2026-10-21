import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Trilha de navegação: `<nav aria-label>` com uma lista de `shy-breadcrumb-item`.
 * O item da página atual leva `current` (`aria-current="page"`), normalmente sem link.
 */
@Component({
  selector: 'shy-breadcrumb',
  exportAs: 'shyBreadcrumb',
  template: '<ol class="list"><ng-content /></ol>',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'label()',
  },
})
export class BreadcrumbComponent {
  readonly label = input('Breadcrumb');
}
