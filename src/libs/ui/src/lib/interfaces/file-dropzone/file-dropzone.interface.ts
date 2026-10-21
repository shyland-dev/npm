/** Motivo da recusa de um arquivo no `shy-file-dropzone`. */
export type ShyFileRejectionReason = 'type' | 'size';

/** Arquivo recusado pela validação (`accept` ou `maxSize`) do `shy-file-dropzone`. */
export interface ShyFileRejection {
  file: File;
  reason: ShyFileRejectionReason;
}
