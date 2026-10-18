import type { DadosProjeto } from "../contratos";
import { Papel } from "../contratos";
import { Projeto } from "./Projeto";

export class ProjetoPublicitario extends Projeto {
  private marca: string;
  private canais: string[];

  constructor(dados: DadosProjeto = {}, marca = "", canais: string[] = []) {
    super("publicitario", {
      papeisNecessarios: [Papel.DIRETOR, Papel.REDATOR, Papel.DIRETOR_ARTE, Papel.EDITOR],
      ...dados,
    });
    this.marca = marca;
    this.canais = [...canais];
  }

  getMarca(): string { return this.marca; }
  getCanais(): string[] { return [...this.canais]; }

  override ajustar(dados: Record<string, unknown>): this {
    super.ajustar(dados);
    if (typeof dados.marca === "string") this.marca = dados.marca;
    if (Array.isArray(dados.canais)) this.canais = [...(dados.canais as string[])];
    return this;
  }

  clonar(): ProjetoPublicitario {
    const c = new ProjetoPublicitario({}, this.marca, this.canais);
    this.copiarEstadoPara(c);
    return c;
  }
}
