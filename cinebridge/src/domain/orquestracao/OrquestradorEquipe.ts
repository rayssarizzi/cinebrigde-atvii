import type { Observador, Profissional, RecomendacaoStrategy, Recomendacoes } from "../contratos";
import type { Projeto } from "../projetos/Projeto";
import type { FabricaProjeto } from "../fabricas/FabricaProjeto";
import { Equipe } from "./Equipe";

export abstract class OrquestradorEquipe {
  constructor(
    protected readonly fabrica: FabricaProjeto,
    protected readonly candidatos: Profissional[] = [],
  ) {}

  orquestrar(projeto: Projeto, estrategia?: RecomendacaoStrategy): Equipe {
    if (!this.validarRestricoes(projeto)) {
      throw new Error(`Projeto ${projeto.getId()} (${projeto.getGenero()}) violou as restrições`);
    }
    const notificador: Observador = this.fabrica.criarNotificador();
    projeto.adicionarObservador(notificador);

    const profissionais = this.normalizarDados(projeto, this.candidatos);
    const usada = estrategia ?? this.fabrica.criarRecomendador();
    const recomendacoes = this.posProcessar(usada.recomendar(projeto, profissionais));

    projeto.notificar("RECOMENDACAO_GERADA");
    return new Equipe(projeto.getId(), recomendacoes);
  }

  protected abstract validarRestricoes(projeto: Projeto): boolean;
  protected abstract normalizarDados(projeto: Projeto, profissionais: Profissional[]): Profissional[];
  protected abstract posProcessar(recomendacoes: Recomendacoes): Recomendacoes;
}
