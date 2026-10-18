import { Profissional } from '../../entities/Profissional';
import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { EstrategiaRecomendacao, precoEstimadoDoProfissional } from './EstrategiaRecomendacao';
import type { CandidatoRanqueado } from '../dtos';

export class RegrasOrcamentoEstrategia implements EstrategiaRecomendacao {
  readonly nome = 'regras_orcamento' as const;

  ranquear(papel: PapelRequisito, candidatos: Profissional[], projeto: Projeto): CandidatoRanqueado[] {
    const fatiaDisponivel = Number(projeto.orcamentoTotal) * Number(papel.peso);

    return candidatos
      .filter((c) => c.especialidades.includes(papel.papel))
      .map((candidato) => {
        const preco = precoEstimadoDoProfissional(candidato);
        const cabeNoOrcamento = preco <= fatiaDisponivel;
        const distanciaDoOrcamento = Math.max(0, preco - fatiaDisponivel) / (fatiaDisponivel || 1);
        const pontuacaoBase = cabeNoOrcamento ? 0.6 : 0.6 - Math.min(distanciaDoOrcamento, 0.6);
        const bonusAvaliacao = (candidato.mediaAvaliacoes() / 5) * 0.4;

        return {
          profissionalId: candidato.id,
          nome: candidato.nome,
          papel: papel.papel,
          pontuacao: Math.max(0, pontuacaoBase + bonusAvaliacao),
          precoEstimado: preco,
        };
      })
      .sort((a, b) => b.pontuacao - a.pontuacao);
  }
}
