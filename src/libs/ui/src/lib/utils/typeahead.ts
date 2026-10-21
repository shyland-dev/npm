/**
 * Busca por digitação (menu e select; interna, não exportada): letras seguidas dentro de 500 ms formam um prefixo;
 * a mesma letra repetida percorre os itens que começam com ela.
 */
export class Typeahead {
  private typed = '';
  private at = 0;

  /** Índice do próximo item cujo texto começa com a busca (a partir do atual), ou -1. `skip` ignora itens (ex.: desabilitados). */
  find(texts: readonly string[], current: number, char: string, skip: (index: number) => boolean = () => false): number {
    const now = Date.now();
    this.typed = now - this.at > 500 ? char.toLowerCase() : this.typed + char.toLowerCase();
    this.at = now;

    const repeated = this.typed.length > 1 && [...this.typed].every((c) => c === this.typed[0]);
    const prefix = repeated ? this.typed[0] : this.typed;
    // Uma letra só (ou repetida) começa depois do item atual, para percorrer os iguais.
    const from = this.typed.length === 1 || repeated ? current + 1 : Math.max(current, 0);
    for (let i = 0; i < texts.length; i++) {
      const index = (from + i) % texts.length;
      if (!skip(index) && texts[index].trim().toLowerCase().startsWith(prefix)) return index;
    }
    return -1;
  }
}
