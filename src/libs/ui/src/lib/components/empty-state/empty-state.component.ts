import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Estado vazio (lista sem itens, busca sem resultado, primeiro uso): `<shy-empty-state heading="Nenhum projeto" icon="inbox">`.
 * O conteúdo padrão é a descrição; a ação (botão/link) vai em `slot="action"`. Não tem role: o texto é lido na ordem do documento.
 * Dentro de uma tabela, use-o numa célula com `colspan` (`<tr><td [attr.colspan]="n"><shy-empty-state /></td></tr>`).
 */
@Component({
  selector: 'shy-empty-state',
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  /** Título curto. */
  readonly heading = input<string>();
  /** Nome do ícone ilustrativo (decorativo). */
  readonly icon = input<string>();
}
