import type { Projeto } from "../projetos/Projeto";
import { ProjetoDocumentario } from "../projetos/ProjetoDocumentario";
import { ValidadorBase } from "./ValidadorBase";

export class ValidadorDocumentario extends ValidadorBase {
  visitarProjeto(projeto: Projeto): boolean {
    if (!(projeto instanceof ProjetoDocumentario)) return false;
    return projeto.getOrcamento() > 0
      && projeto.getTema().trim().length > 0
      && projeto.getEntrevistados().length > 0;
  }
}
