import type { ComposicaoEquipe, PapelAlocado } from '../dtos';

export interface VisitanteComposicao<R> {
  visitarPapel(papel: PapelAlocado): void;
  visitarComposicao(composicao: ComposicaoEquipe): void;
  obterResultado(): R;
}
