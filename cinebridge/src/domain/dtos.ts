import type { NomeEstrategia, Papel, TipoCaptacao } from './tipos';

export interface PapelRequisitoDTO {
  papel: Papel;
  peso: number;
  requisitosCompetencia?: Record<string, number>;
}

export interface CriarProjetoDTO {
  genero: string;
  duracaoEstimadaMinutos: number;
  orcamentoTotal: number;
  dataEntrega: string;
  tipoCaptacao: TipoCaptacao;
  localizacao: string;
  estrategiaPreferida?: NomeEstrategia;
  papeis: PapelRequisitoDTO[];
}

export interface CandidatoRanqueado {
  profissionalId: string;
  nome: string;
  papel: Papel;
  pontuacao: number;
  precoEstimado: number;
}

export interface PapelAlocado {
  papel: Papel;
  peso: number;
  titular: CandidatoRanqueado | null;
  alternativas: CandidatoRanqueado[];
}

export interface ComposicaoEquipe {
  projetoId: string;
  estrategiaUsada: NomeEstrategia;
  papeis: PapelAlocado[];
  custoEstimadoTotal: number;
  parcial: boolean;
  geradaEm: string;
}
