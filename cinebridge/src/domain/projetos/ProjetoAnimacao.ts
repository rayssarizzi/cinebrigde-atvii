import type { DadosProjeto } from "../contratos";
import { Papel } from "../contratos";
import { Projeto } from "./Projeto";

export class ProjetoAnimacao extends Projeto {
  private tecnica: "2D" | "3D";
  private softwares: string[];

  constructor(dados: DadosProjeto = {}, tecnica: "2D" | "3D" = "3D", softwares: string[] = []) {
    super("animacao", {
      papeisNecessarios: [Papel.DIRETOR, Papel.ROTEIRISTA, Papel.ANIMADOR_3D, Papel.RIGGER, Papel.PRODUTOR],
      ...dados,
    });
    this.tecnica = tecnica;
    this.softwares = [...softwares];
  }

  getTecnica(): "2D" | "3D" { return this.tecnica; }
  getSoftwares(): string[] { return [...this.softwares]; }

  override ajustar(dados: Record<string, unknown>): this {
    super.ajustar(dados);
    if (dados.tecnica === "2D" || dados.tecnica === "3D") this.tecnica = dados.tecnica;
    if (Array.isArray(dados.softwares)) this.softwares = [...(dados.softwares as string[])];
    return this;
  }

  clonar(): ProjetoAnimacao {
    const c = new ProjetoAnimacao({}, this.tecnica, this.softwares);
    this.copiarEstadoPara(c);
    return c;
  }
}
