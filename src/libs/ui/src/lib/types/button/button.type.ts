export type ShyButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ShyButtonSize = 'sm' | 'md' | 'lg';
export type ShyButtonLoadingPosition = 'start' | 'end' | 'replace';
/** IconButton não tem `link`: sem texto, não há sublinhado que o identifique. */
export type ShyIconButtonVariant = Exclude<ShyButtonVariant, 'link'>;
