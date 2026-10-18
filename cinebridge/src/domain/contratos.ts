import type { Projeto } from "./projetos/Projeto";

export enum Papel {
  DIRETOR = "DIRETOR",
  ROTEIRISTA = "ROTEIRISTA",
  PRODUTOR = "PRODUTOR",
  EDITOR = "EDITOR",
  PESQUISADOR = "PESQUISADOR",
  ANIMADOR_3D = "ANIMADOR_3D",
  RIGGER = "RIGGER",
  REDATOR = "REDATOR",
  DIRETOR_ARTE = "DIRETOR_ARTE",
}

export interface Profissional {
  id: string;
  nome: string;
  habilidades: string[];
  papeis: Papel[];
  custo: number;
  nota: number;
  disponivel: boolean;
}

export type Recomendacoes = Map<Papel, Profissional[]>;

export type TipoEvento =
  | "RECOMENDACAO_GERADA"
  | "RECOMENDACAO_ACEITA"
  | "MEMBRO_SUBSTITUIDO"
  | "REAVALIACAO_SOLICITADA";

export interface EventoRecomendacao {
  tipo: TipoEvento;
  projetoId: string;
  genero: string;
  papel?: Papel;
  profissional?: Profissional;
  quando: Date;
}

export type Restricoes = Record<string, number | string | string[]>;

export interface DadosProjeto {
  id?: string;
  duracao?: number;
  orcamento?: number;
  prazo?: Date;
  papeisNecessarios?: Papel[];
  restricoes?: Restricoes;
}

export interface RecomendacaoStrategy {
  recomendar(projeto: Projeto, profissionais: Profissional[]): Recomendacoes;
}

export interface VisitanteProjeto {
  visitarProjeto(projeto: Projeto): boolean;
  visitarProfissional(profissional: Profissional): boolean;
}

export interface Observador {
  atualizar(evento: EventoRecomendacao): void;
}
