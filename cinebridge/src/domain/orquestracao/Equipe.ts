import type { Papel, Profissional, Recomendacoes } from "../contratos";

export class Equipe {
  constructor(
    readonly projetoId: string,
    readonly recomendacoes: Recomendacoes,
  ) {}

  titulares(): Map<Papel, Profissional> {
    const m = new Map<Papel, Profissional>();
    for (const [papel, lista] of this.recomendacoes) if (lista.length) m.set(papel, lista[0]);
    return m;
  }

  custoTitulares(): number {
    return [...this.titulares().values()].reduce((s, p) => s + p.custo, 0);
  }
}
