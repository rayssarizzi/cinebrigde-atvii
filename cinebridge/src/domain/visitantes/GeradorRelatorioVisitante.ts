import type { ComposicaoEquipe, PapelAlocado } from '../dtos';
import { VisitanteComposicao } from './VisitanteComposicao';

export interface RelatorioEquipe {
  projetoId: string;
  estrategiaUsada: string;
  linhas: string[];
  custoEstimadoTotal: number;
}

export class GeradorRelatorioVisitante implements VisitanteComposicao<RelatorioEquipe> {
  private linhas: string[] = [];
  private projetoId = '';
  private estrategiaUsada = '';
  private custoEstimadoTotal = 0;

  visitarPapel(papel: PapelAlocado): void {
    if (papel.titular) {
      this.linhas.push(
        `${papel.papel}: ${papel.titular.nome} (pontuacao ${papel.titular.pontuacao.toFixed(2)}, ${papel.alternativas.length} alternativa(s))`,
      );
    } else {
      this.linhas.push(`${papel.papel}: nenhum candidato disponivel`);
    }
  }

  visitarComposicao(composicao: ComposicaoEquipe): void {
    this.projetoId = composicao.projetoId;
    this.estrategiaUsada = composicao.estrategiaUsada;
    this.custoEstimadoTotal = composicao.custoEstimadoTotal;
  }

  obterResultado(): RelatorioEquipe {
    return {
      projetoId: this.projetoId,
      estrategiaUsada: this.estrategiaUsada,
      linhas: this.linhas,
      custoEstimadoTotal: this.custoEstimadoTotal,
    };
  }
}
