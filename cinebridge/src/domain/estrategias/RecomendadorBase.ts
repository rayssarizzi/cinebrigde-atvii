import type { Profissional, RecomendacaoStrategy, Recomendacoes } from "../contratos";
import type { Projeto } from "../projetos/Projeto";

export abstract class RecomendadorBase implements RecomendacaoStrategy {
  protected abstract habilidadesChave(projeto: Projeto): string[];
  protected readonly maximoPorPapel = 3;

  recomendar(projeto: Projeto, profissionais: Profissional[]): Recomendacoes {
    const chaves = this.habilidadesChave(projeto).map((h) => h.toLowerCase());
    const resultado: Recomendacoes = new Map();
    for (const papel of projeto.getPapeisNecessarios()) {
      const ranking = profissionais
        .filter((p) => p.papeis.includes(papel))
        .map((p) => ({ p, score: this.pontuar(p, chaves) }))
        .sort((a, b) => b.score - a.score || a.p.custo - b.p.custo)
        .slice(0, this.maximoPorPapel)
        .map((x) => x.p);
      resultado.set(papel, ranking);
    }
    return resultado;
  }

  private pontuar(p: Profissional, chaves: string[]): number {
    const hab = p.habilidades.map((h) => h.toLowerCase());
    const casadas = chaves.filter((c) => hab.includes(c)).length;
    const cobertura = chaves.length ? casadas / chaves.length : 0;
    return cobertura * 10 * 0.7 + p.nota * 0.3;
  }
}
