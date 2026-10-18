import type { ComposicaoEquipe, PapelAlocado } from '../dtos';
import { VisitanteComposicao } from './VisitanteComposicao';

export class PontuacaoCompatibilidadeVisitante implements VisitanteComposicao<number> {
  private somaPonderada = 0;
  private somaPesos = 0;

  visitarPapel(papel: PapelAlocado): void {
    this.somaPesos += papel.peso;
    this.somaPonderada += (papel.titular?.pontuacao ?? 0) * papel.peso;
  }

  visitarComposicao(_composicao: ComposicaoEquipe): void {
  }

  obterResultado(): number {
    if (this.somaPesos === 0) return 0;
    return Number((this.somaPonderada / this.somaPesos).toFixed(4));
  }
}
