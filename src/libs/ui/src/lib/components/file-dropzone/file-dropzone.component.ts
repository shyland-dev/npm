import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, input, model, numberAttribute, output, signal, viewChild } from '@angular/core';
import { ShyFileRejection } from '../../interfaces/file-dropzone/file-dropzone.interface';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';
import { ControlBase } from '../toggle/control-base';

const KIB = 1024;

/** `accept` do input nativo: extensões (`.pdf`), tipos (`image/png`) e curingas (`image/*`), separados por vírgula. */
function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => (rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

function formatSize(bytes: number): string {
  if (bytes < KIB) return `${bytes} B`;
  if (bytes < KIB * KIB) return `${(bytes / KIB).toFixed(1)} KB`;
  return `${(bytes / KIB / KIB).toFixed(1)} MB`;
}

/**
 * Área para escolher ou soltar arquivos. O `<input type="file">` nativo cobre a área (abre o seletor por clique, Enter e Espaço e
 * recebe o foco do teclado); o arrastar e soltar passa pela mesma validação. **Só seleciona e valida: nunca envia nada.**
 *
 * - Valor: `File[]` por `[(files)]`, `ngModel` ou `formControl`. Sem `multiple`, uma nova escolha substitui a anterior.
 * - `accept` (extensões, tipos e curingas como no nativo) e `maxSize` (em bytes) recusam arquivos; `(rejected)` lista cada recusa
 *   com o motivo e a região de status anuncia o resumo.
 * - Conteúdo projetado substitui o texto padrão da área; a lista de arquivos tem botão de remover por item.
 */
@Component({
  selector: 'shy-file-dropzone',
  exportAs: 'shyFileDropzone',
  imports: [IconComponent, IconButtonComponent],
  templateUrl: './file-dropzone.component.html',
  styleUrl: './file-dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-dragging]': 'dragging() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'showInvalid() ? "" : null',
  },
})
export class FileDropzoneComponent extends ControlBase<File[]> {
  private readonly picker = viewChild.required<ElementRef<HTMLInputElement>>('picker');

  readonly files = model<File[]>([]);
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Tamanho máximo por arquivo, em bytes (sem limite se omitido). */
  readonly maxSize = input<number | undefined, number | string | null | undefined>(undefined, { transform: (v) => (v == null || v === '' ? undefined : numberAttribute(v)) });
  /** Textos da interface (troque para traduzir). */
  readonly prompt = input('Drop files here or click to choose');
  readonly removeLabel = input('Remove');
  /** Emite os arquivos recusados de uma escolha. */
  readonly rejected = output<ShyFileRejection[]>();

  protected readonly dragging = signal(false);
  protected readonly status = signal('');
  protected readonly items = computed(() => this.files().map((file) => ({ file, size: formatSize(file.size) })));

  override writeValue(value: unknown): void {
    this.files.set(Array.isArray(value) ? (value as File[]) : []);
    if (!this.files().length) this.picker().nativeElement.value = '';
  }

  protected onPick(input: HTMLInputElement): void {
    this.accepted(Array.from(input.files ?? []));
    // O nativo guarda a seleção: limpar permite escolher o mesmo arquivo de novo depois de removê-lo.
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(): void {
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.isDisabled()) return;
    this.accepted(Array.from(event.dataTransfer?.files ?? []));
  }

  private accepted(incoming: File[]): void {
    if (!incoming.length) return;
    const accepted: File[] = [];
    const rejections: ShyFileRejection[] = [];
    for (const file of incoming) {
      const max = this.maxSize();
      if (!matchesAccept(file, this.accept())) rejections.push({ file, reason: 'type' });
      else if (max !== undefined && file.size > max) rejections.push({ file, reason: 'size' });
      else accepted.push(file);
    }
    if (!this.multiple() && accepted.length > 1) accepted.splice(1);
    if (accepted.length) this.commit(this.multiple() ? [...this.files(), ...accepted] : accepted);
    if (rejections.length) this.rejected.emit(rejections);
    this.status.set(this.summary(accepted.length, rejections));
    this.touched();
  }

  protected remove(file: File): void {
    this.commit(this.files().filter((f) => f !== file));
    this.status.set(`${file.name} removed`);
  }

  private commit(files: File[]): void {
    this.files.set(files);
    this.onChange(files);
  }

  private summary(added: number, rejections: ShyFileRejection[]): string {
    const parts: string[] = [];
    if (added) parts.push(`${added} ${added === 1 ? 'file' : 'files'} added`);
    for (const { file, reason } of rejections) parts.push(`${file.name} rejected: ${reason === 'type' ? 'file type not allowed' : `larger than ${formatSize(this.maxSize() ?? 0)}`}`);
    return parts.join('. ');
  }
}
