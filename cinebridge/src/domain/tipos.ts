export type TipoCaptacao = 'documentario' | 'ficcao' | 'animacao';

export type Papel = string;

export const PAPEIS_PADRAO = [
  'diretor',
  'diretor_fotografia',
  'sonoplasta',
  'editor',
  'roteirista',
  'especialista_efeitos_visuais',
] as const;

export type NomeEstrategia = 'similaridade_cosseno' | 'filtragem_colaborativa' | 'regras_orcamento' | 'auto';

export type StatusConvite = 'pendente' | 'aceito' | 'recusado' | 'substituido';

export type StatusRecomendacao = 'sugerida' | 'confirmada' | 'descartada';

export interface VetorCompetencias {
  [competenciaId: string]: number;
}

export interface FaixaPreco {
  minimo: number;
  maximo: number;
}

export interface JanelaDisponibilidade {
  inicio: string;
  fim: string;
}
