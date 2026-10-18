import type { Projeto } from "../projetos/Projeto";
import { ProjetoPublicitario } from "../projetos/ProjetoPublicitario";
import { ValidadorBase } from "./ValidadorBase";

export class ValidadorPublicitario extends ValidadorBase {
  visitarProjeto(projeto: Projeto): boolean {
    if (!(projeto instanceof ProjetoPublicitario)) return false;
    return projeto.getOrcamento() > 0
      && projeto.getMarca().trim().length > 0
      && projeto.getDuracao() > 0 && projeto.getDuracao() <= 5
      && projeto.getPrazo().getTime() > Date.now();
  }
}
