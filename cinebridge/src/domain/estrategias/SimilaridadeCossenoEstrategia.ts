import { Profissional } from '../../entities/Profissional';
import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { EstrategiaRecomendacao, precoEstimadoDoProfissional } from './EstrategiaRecomendacao';
import type { CandidatoRanqueado } from '../dtos';

function similaridadeCosseno(a: Record<string, number>, b: Record<string, number>): number {
  const chaves = new Set([...Object.keys(a), ...Object.keys(b)]);
  let produtoInterno = 0;
  let normaA = 0;
  let normaB = 0;

  for (const chave of chaves) {
    const valorA = a[chave] ?? 0;
    const valorB = b[chave] ?? 0;
    produtoInterno += valorA * valorB;
    normaA += valorA * valorA;
    normaB += valorB * valorB;
  }

  if (normaA === 0 || normaB === 0) return 0;
  return produtoInterno / (Math.sqrt(normaA) * Math.sqrt(normaB));
}

export class SimilaridadeCossenoEstrategia implements EstrategiaRecomendacao {
  readonly nome = 'similaridade_cosseno' as const;

  ranquear(papel: PapelRequisito, candidatos: Profissional[], _projeto: Projeto): CandidatoRanqueado[] {
    return candidatos
      .filter((c) => c.especialidades.includes(papel.papel))
      .map((candidato) => {
        const vetorCandidato = candidato.vetorCompetencias ?? {};
        const pontuacao = similaridadeCosseno(papel.requisitosCompetencia ?? {}, vetorCandidato);
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
