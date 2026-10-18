import { Profissional } from '../../entities/Profissional';
import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import type { CandidatoRanqueado } from '../dtos';

export interface EstrategiaRecomendacao {
  readonly nome: 'similaridade_cosseno' | 'filtragem_colaborativa' | 'regras_orcamento';
  ranquear(papel: PapelRequisito, candidatos: Profissional[], projeto: Projeto): CandidatoRanqueado[];
}

export function precoEstimadoDoProfissional(profissional: Profissional): number {
  return (Number(profissional.precoMinimo) + Number(profissional.precoMaximo)) / 2;
}
