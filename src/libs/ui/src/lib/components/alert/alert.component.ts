import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ShyAlertIntent } from '../../types/alert/alert.type';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

const ICONS: Record<ShyAlertIntent, string> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  danger: 'exclamation-circle',
};

/**
 * Mensagem em destaque, na página (não é toast): ícone por intenção + `heading` + texto projetado + ação (`slot="action"`).
 *
 * - O ícone e o título dizem o tipo em palavras e forma: nunca só a cor. Escreva o título como "Erro ao salvar", não "Ops".
 * - `role="status"` (educado) por padrão. `role="alert"` (interrompe o leitor) só com `urgent` em `warning`/`danger`;
 *   `info` e `success` são sempre `status`. Vale para conteúdo que aparece depois do carregamento da página.
 * - `dismissible` mostra o botão de fechar (`dismissLabel`); o alerta se oculta e emite `dismissed`. Gerenciar o foco depois é do app.
 */
@Component({
  selector: 'shy-alert',
  imports: [IconComponent, IconButtonComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-intent]': 'intent()',
    '[attr.role]': 'role()',
    '[attr.hidden]': 'closed() ? "" : null',
  },
})
export class AlertComponent {
  readonly intent = input<ShyAlertIntent>('info');
  /** Título curto. Não se chama `title` para o navegador não criar tooltip/nome acessível no host. */
  readonly heading = input<string>();
  /** Nome de um ícone do catálogo; o padrão depende da intenção. */
  readonly icon = input<string>();
  /** `role="alert"` em `warning`/`danger` (interrompe o leitor de tela). */
  readonly urgent = input(false, { transform: booleanAttribute });
  readonly dismissible = input(false, { transform: booleanAttribute });
  /** Nome acessível do botão de fechar. */
  readonly dismissLabel = input('Dismiss');
  readonly dismissed = output<void>();

  protected readonly closed = signal(false);
  protected readonly iconName = computed(() => this.icon() ?? ICONS[this.intent()]);
  protected readonly role = computed(() => (this.urgent() && (this.intent() === 'danger' || this.intent() === 'warning') ? 'alert' : 'status'));

  protected dismiss(): void {
    this.closed.set(true);
    this.dismissed.emit();
  }
}
