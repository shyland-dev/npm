/** Padrão curto de "toque confirmado" (ms). */
export const HAPTIC_TAP = 10;

/**
 * Vibração curta de confirmação (Vibration API), sem efeito onde não há suporte (Safari/iOS, desktop) e sem erro no servidor.
 * Não vibra com reduced motion (`prefers-reduced-motion` ou `data-motion="reduced"`) nem antes de a pessoa ter interagido com a
 * página (o Chrome bloqueia e avisa no console). Usada só quando quem abriu o componente ligou `haptics`.
 */
export function haptic(doc: Document, pattern: number | number[] = HAPTIC_TAP): void {
  const nav = doc.defaultView?.navigator;
  if (!nav || typeof nav.vibrate !== 'function') return;
  if (doc.documentElement.getAttribute('data-motion') === 'reduced' || doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  if ((nav as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive === false) return;
  try {
    nav.vibrate(pattern);
  } catch {
    // Alguns navegadores lançam sem permissão; haptics é só um reforço.
  }
}
