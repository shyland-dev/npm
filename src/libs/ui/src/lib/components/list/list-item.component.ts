import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Linha de um `shy-list`. Conteúdo padrão = texto principal; `slot="start"` (avatar, ícone), `slot="secondary"` (texto de apoio) e `slot="end"` (meta, ação).
 *
 * - Sem `href` nem `interactive`: linha estática.
 * - `href`: a linha é um link nativo (`<a>`). `interactive`: é um botão nativo e emite `activated`.
 * - `selected` marca a linha atual (`aria-current="true"`); `disabled` vale para o botão.
 * Não coloque controles (botões/links) dentro de uma linha clicável: nesse caso mantenha-a estática e ponha a ação em `slot="end"`.
 */
@Component({
  selector: 'shy-list-item',
  imports: [NgTemplateOutlet],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class ListItemComponent {
  readonly href = input<string>();
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Clique/Enter/Espaço numa linha `interactive`. */
  readonly activated = output<void>();
}
