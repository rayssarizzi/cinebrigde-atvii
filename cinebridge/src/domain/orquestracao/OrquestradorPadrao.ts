import type { Profissional, Recomendacoes } from "../contratos";
import type { Projeto } from "../projetos/Projeto";
import { OrquestradorEquipe } from "./OrquestradorEquipe";

export class OrquestradorPadrao extends OrquestradorEquipe {
  protected validarRestricoes(projeto: Projeto): boolean {
    return projeto.aceitarVisitante(this.fabrica.criarValidador());
  }

  protected normalizarDados(_projeto: Projeto, profissionais: Profissional[]): Profissional[] {
    const validador = this.fabrica.criarValidador();
    const vistos = new Set<string>();
    return profissionais.filter((p) => {
      if (vistos.has(p.id) || !validador.visitarProfissional(p)) return false;
      vistos.add(p.id);
      return true;
    });
  }

  protected posProcessar(recomendacoes: Recomendacoes): Recomendacoes {
    const saida: Recomendacoes = new Map();
    for (const [papel, lista] of recomendacoes) if (lista.length) saida.set(papel, lista);
    return saida;
  }
}
