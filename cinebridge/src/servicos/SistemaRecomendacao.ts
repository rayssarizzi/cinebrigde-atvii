import type { Profissional } from "../domain/contratos";
import type { Projeto } from "../domain/projetos/Projeto";
import type { FabricaProjeto } from "../domain/fabricas/FabricaProjeto";
import { NotificadorBase } from "../domain/notificacoes/NotificadorBase";
import type { Equipe } from "../domain/orquestracao/Equipe";
import type { OrquestradorEquipe } from "../domain/orquestracao/OrquestradorEquipe";
import { OrquestradorPadrao } from "../domain/orquestracao/OrquestradorPadrao";

export interface SolicitacaoRecomendacao {
  genero: string;
  dados: Record<string, unknown>;

  profissionais: Profissional[];
}

export interface ResultadoRecomendacao {
  projeto: Projeto;
  equipe: Equipe;
  notificacoes: string[];
}

export class SistemaRecomendacao {
  private readonly fabricas = new Map<string, FabricaProjeto>();

  constructor(
    fabricas: FabricaProjeto[],
    private readonly criarOrquestrador: (f: FabricaProjeto, c: Profissional[]) => OrquestradorEquipe =
      (f, c) => new OrquestradorPadrao(f, c),
  ) {
    fabricas.forEach((f) => this.registrarFabrica(f));
  }

  registrarFabrica(fabrica: FabricaProjeto): void {
    this.fabricas.set(fabrica.genero, fabrica);
  }

  generosSuportados(): string[] {
    return [...this.fabricas.keys()];
  }

  recomendar(s: SolicitacaoRecomendacao): ResultadoRecomendacao {
    const fabrica = this.fabricas.get(s.genero);
    if (!fabrica) {
      throw new GeneroNaoSuportadoError(s.genero, this.generosSuportados());
    }
    const projeto = fabrica.criarProjeto(s.dados);
    const equipe = this.criarOrquestrador(fabrica, s.profissionais).orquestrar(projeto);
    const notificacoes = projeto
      .getObservadores()
      .flatMap((o) => (o instanceof NotificadorBase ? o.mensagens : []));
    return { projeto, equipe, notificacoes };
  }
}

export class GeneroNaoSuportadoError extends Error {
  constructor(readonly genero: string, readonly suportados: string[]) {
    super(`Gênero não suportado: "${genero}". Suportados: ${suportados.join(", ")}`);
    this.name = "GeneroNaoSuportadoError";
  }
}
