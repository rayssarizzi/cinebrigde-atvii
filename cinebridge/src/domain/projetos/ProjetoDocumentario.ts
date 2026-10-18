import type { DadosProjeto } from "../contratos";
import { Papel } from "../contratos";
import { Projeto } from "./Projeto";

export class ProjetoDocumentario extends Projeto {
  private tema: string;
  private entrevistados: string[];

  constructor(dados: DadosProjeto = {}, tema = "", entrevistados: string[] = []) {
    super("documentario", {
      papeisNecessarios: [Papel.DIRETOR, Papel.PESQUISADOR, Papel.EDITOR, Papel.PRODUTOR],
      ...dados,
    });
    this.tema = tema;
    this.entrevistados = [...entrevistados];
  }

  getTema(): string { return this.tema; }
  getEntrevistados(): string[] { return [...this.entrevistados]; }

  override ajustar(dados: Record<string, unknown>): this {
    super.ajustar(dados);
    if (typeof dados.tema === "string") this.tema = dados.tema;
    if (Array.isArray(dados.entrevistados)) this.entrevistados = [...(dados.entrevistados as string[])];
    return this;
  }

  clonar(): ProjetoDocumentario {
    const c = new ProjetoDocumentario({}, this.tema, this.entrevistados);
    this.copiarEstadoPara(c);
    return c;
  }
}
