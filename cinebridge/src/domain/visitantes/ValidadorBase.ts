import type { Profissional, VisitanteProjeto } from "../contratos";
import type { Projeto } from "../projetos/Projeto";

export abstract class ValidadorBase implements VisitanteProjeto {
  abstract visitarProjeto(projeto: Projeto): boolean;

  visitarProfissional(p: Profissional): boolean {
    return p.disponivel && p.custo > 0 && p.nota >= 0 && p.nota <= 10;
  }
}
