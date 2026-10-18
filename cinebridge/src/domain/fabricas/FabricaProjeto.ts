import { randomUUID } from "node:crypto";
import type { Observador, RecomendacaoStrategy, VisitanteProjeto } from "../contratos";
import type { Projeto } from "../projetos/Projeto";

export abstract class FabricaProjeto {
  protected readonly prototipo: Projeto;

  protected constructor(prototipo: Projeto) {
    this.prototipo = prototipo.clonar();
  }

  get genero(): string {
    return this.prototipo.getGenero();
  }

  criarProjeto(dados: Record<string, unknown> = {}): Projeto {
    return this.prototipo.clonar().ajustar({ id: randomUUID(), ...dados });
  }

  abstract criarValidador(): VisitanteProjeto;
  abstract criarRecomendador(): RecomendacaoStrategy;
  abstract criarNotificador(): Observador;
}
