import type { ComposicaoEquipe } from '../dtos';
import { VisitanteComposicao } from './VisitanteComposicao';

export class ComposicaoVisitavel {
  constructor(private readonly composicao: ComposicaoEquipe) {}

  aceitar<R>(visitante: VisitanteComposicao<R>): R {
    for (const papel of this.composicao.papeis) {
      visitante.visitarPapel(papel);
    }
    visitante.visitarComposicao(this.composicao);
    return visitante.obterResultado();
  }
}
