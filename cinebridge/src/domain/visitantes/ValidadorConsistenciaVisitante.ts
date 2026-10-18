import type { ComposicaoEquipe, PapelAlocado } from '../dtos';
import { VisitanteComposicao } from './VisitanteComposicao';

export interface ResultadoValidacao {
  valido: boolean;
  papeisSemTitular: string[];
  orcamentoExcedido: boolean;
}

export class ValidadorConsistenciaVisitante implements VisitanteComposicao<ResultadoValidacao> {
  private papeisSemTitular: string[] = [];
  private orcamentoExcedido = false;

  visitarPapel(papel: PapelAlocado): void {
    if (!papel.titular) {
      this.papeisSemTitular.push(papel.papel);
    }
  }

  visitarComposicao(composicao: ComposicaoEquipe): void {
    this.orcamentoExcedido = false;
    void composicao;
  }

  obterResultado(): ResultadoValidacao {
    return {
      valido: this.papeisSemTitular.length === 0 && !this.orcamentoExcedido,
      papeisSemTitular: this.papeisSemTitular,
      orcamentoExcedido: this.orcamentoExcedido,
    };
  }
}
