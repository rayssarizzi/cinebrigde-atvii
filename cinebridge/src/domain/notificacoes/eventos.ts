import type { ComposicaoEquipe } from '../dtos';
import type { Convite } from '../../entities/Convite';

export type NomeEvento = 'equipe_recomendada' | 'convite_respondido' | 'equipe_reavaliada';

export interface PayloadEquipeRecomendada {
  projetoId: string;
  composicao: ComposicaoEquipe;
}

export interface PayloadConviteRespondido {
  convite: Convite;
  aceito: boolean;
}

export interface PayloadEquipeReavaliada {
  projetoId: string;
  motivo: string;
  composicao: ComposicaoEquipe;
}
