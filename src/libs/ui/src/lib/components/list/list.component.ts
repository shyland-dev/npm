import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Lista de linhas: `<shy-list label="Contatos"><shy-list-item>…</shy-list-item></shy-list>`.
 * Semântica de lista (`role="list"`/`listitem`); `label` dá o nome acessível. Para itens clicáveis, veja `shy-list-item`.
 */
@Component({
  selector: 'shy-list',
  template: '<ng-content />',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'list' },
})
export class ListComponent {}
