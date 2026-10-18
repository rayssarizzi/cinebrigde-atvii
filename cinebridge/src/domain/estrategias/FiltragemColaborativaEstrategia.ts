import { Profissional } from '../../entities/Profissional';
import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { EstrategiaRecomendacao, precoEstimadoDoProfissional } from './EstrategiaRecomendacao';
import type { CandidatoRanqueado } from '../dtos';

export class FiltragemColaborativaEstrategia implements EstrategiaRecomendacao {
  readonly nome = 'filtragem_colaborativa' as const;

  ranquear(papel: PapelRequisito, candidatos: Profissional[], projeto: Projeto): CandidatoRanqueado[] {
    return candidatos
      .filter((c) => c.especialidades.includes(papel.papel))
      .map((candidato) => {
        const media = candidato.mediaAvaliacoes();
        const experiencia = Math.min(candidato.projetosConcluidos / 20, 1);
        const pontuacao = media > 0 ? (media / 5) * 0.75 + experiencia * 0.25 : experiencia * 0.25;

        return {
          profissionalId: candidato.id,
          nome: candidato.nome,
          papel: papel.papel,
          pontuacao,
          precoEstimado: precoEstimadoDoProfissional(candidato),
        };
      })
      .sort((a, b) => b.pontuacao - a.pontuacao);
  }
}
