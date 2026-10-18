import type { Projeto } from "../projetos/Projeto";
import { ProjetoAnimacao } from "../projetos/ProjetoAnimacao";
import { RecomendadorBase } from "./RecomendadorBase";

export class RecomendadorAnimacao extends RecomendadorBase {
  protected habilidadesChave(projeto: Projeto): string[] {
    const base = ["modelagem 3d", "rigging", "renderizacao"];
    return projeto instanceof ProjetoAnimacao ? [...base, ...projeto.getSoftwares()] : base;
  }
}
