import { Projeto } from '../../entities/Projeto';
import { EstrategiaRecomendacao } from './EstrategiaRecomendacao';
import { SimilaridadeCossenoEstrategia } from './SimilaridadeCossenoEstrategia';
import { FiltragemColaborativaEstrategia } from './FiltragemColaborativaEstrategia';
import { RegrasOrcamentoEstrategia } from './RegrasOrcamentoEstrategia';
import type { NomeEstrategia } from '../tipos';

export class SeletorEstrategia {
  private readonly estrategias: Record<Exclude<NomeEstrategia, 'auto'>, EstrategiaRecomendacao> = {
    similaridade_cosseno: new SimilaridadeCossenoEstrategia(),
    filtragem_colaborativa: new FiltragemColaborativaEstrategia(),
    regras_orcamento: new RegrasOrcamentoEstrategia(),
  };

  resolver(projeto: Projeto): EstrategiaRecomendacao {
    const escolha = projeto.estrategiaPreferida;

    if (escolha && escolha !== 'auto') {
      return this.estrategias[escolha];
    }

    if (projeto.ehOrcamentoReduzido()) {
      return this.estrategias.regras_orcamento;
    }

    return this.estrategias.similaridade_cosseno;
  }
}
