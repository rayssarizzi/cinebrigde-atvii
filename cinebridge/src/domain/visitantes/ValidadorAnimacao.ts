import type { Profissional } from "../contratos";
import type { Projeto } from "../projetos/Projeto";
import { ProjetoAnimacao } from "../projetos/ProjetoAnimacao";
import { ValidadorBase } from "./ValidadorBase";

export class ValidadorAnimacao extends ValidadorBase {
  visitarProjeto(projeto: Projeto): boolean {
    if (!(projeto instanceof ProjetoAnimacao)) return false;
    return projeto.getOrcamento() > 0
      && projeto.getDuracao() > 0
      && projeto.getSoftwares().length > 0;
  }

  override visitarProfissional(p: Profissional): boolean {
    return super.visitarProfissional(p) && p.nota >= 6;
  }
}
