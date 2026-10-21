import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { ShyAvatarShape, ShyAvatarSize } from '../../types/avatar/avatar.type';
import { IconComponent } from '../icon/icon.component';

/**
 * Foto ou identidade de uma pessoa/entidade: `<shy-avatar src="/ana.jpg" name="Ana Souza" />`.
 *
 * Mostra `src`; se faltar ou falhar ao carregar, mostra as iniciais de `name` (até 2 letras) e, sem `name`, um ícone.
 * `label` (padrão: `name`) é o nome acessível (`role="img"`). Sem `label` nem `name` o avatar é decorativo (`aria-hidden`):
 * use assim quando o nome já aparece em texto ao lado.
 */
@Component({
  selector: 'shy-avatar',
  imports: [IconComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.role]': 'accessibleName() ? "img" : null',
    '[attr.aria-label]': 'accessibleName() || null',
    '[attr.aria-hidden]': 'accessibleName() ? null : "true"',
  },
})
export class AvatarComponent {
  readonly src = input<string>();
  /** Nome da pessoa: origem das iniciais e do nome acessível. */
  readonly name = input<string>();
  /** Nome acessível, quando diferente de `name`. */
  readonly label = input<string>();
  readonly size = input<ShyAvatarSize>('md');
  readonly shape = input<ShyAvatarShape>('circle');

  /** A imagem falhou: mostra as iniciais/ícone até o `src` mudar. */
  private readonly failed = signal(false);

  protected readonly showImage = computed(() => !!this.src() && !this.failed());
  protected readonly accessibleName = computed(() => this.label()?.trim() || this.name()?.trim() || '');
  protected readonly initials = computed(() => {
    const words = (this.name() ?? '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const first = Array.from(words[0])[0];
    const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
    return (first + last).toLocaleUpperCase();
  });

  constructor() {
    effect(() => {
      this.src();
      this.failed.set(false);
    });
  }

  protected onError(): void {
    this.failed.set(true);
  }
}
