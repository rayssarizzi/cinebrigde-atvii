import { randomUUID } from "node:crypto";
import type {
  DadosProjeto,
  EventoRecomendacao,
  Observador,
  Papel,
  Profissional,
  Restricoes,
  TipoEvento,
  VisitanteProjeto,
} from "../contratos";

export abstract class Projeto {
  private id: string;
  private readonly genero: string;
  private duracao: number;
  private orcamento: number;
  private prazo: Date;
  private papeisNecessarios: Papel[];
  private restricoes: Restricoes;
  private equipe = new Map<Papel, Profissional>();
  private observadores: Observador[] = [];

  protected constructor(genero: string, dados: DadosProjeto = {}) {
    this.genero = genero;
    this.id = randomUUID();
    this.duracao = 0;
    this.orcamento = 0;
    this.prazo = new Date();
    this.papeisNecessarios = [];
    this.restricoes = {};
    this.aplicarDadosBase(dados as Record<string, unknown>);
  }

  abstract clonar(): Projeto;

  protected copiarEstadoPara(destino: Projeto): void {
    destino.id = this.id;
    destino.duracao = this.duracao;
    destino.orcamento = this.orcamento;
    destino.prazo = new Date(this.prazo.getTime());
    destino.papeisNecessarios = [...this.papeisNecessarios];
    destino.restricoes = structuredClone(this.restricoes);
    destino.equipe = new Map(
      [...this.equipe].map(([papel, p]) => [papel, structuredClone(p)] as [Papel, Profissional]),
    );
    destino.observadores = [];
  }

  ajustar(dados: Record<string, unknown>): this {
    this.aplicarDadosBase(dados);
    return this;
  }

  private aplicarDadosBase(dados: Record<string, unknown>): void {
    if (typeof dados.id === "string") this.id = dados.id;
    if (typeof dados.duracao === "number") this.duracao = dados.duracao;
    if (typeof dados.orcamento === "number") this.orcamento = dados.orcamento;
    if (dados.prazo instanceof Date) this.prazo = new Date(dados.prazo.getTime());
    if (Array.isArray(dados.papeisNecessarios)) this.papeisNecessarios = [...(dados.papeisNecessarios as Papel[])];
    if (dados.restricoes && typeof dados.restricoes === "object") {
      this.restricoes = structuredClone(dados.restricoes as Restricoes);
    }
  }

  getId(): string { return this.id; }
  getGenero(): string { return this.genero; }
  getDuracao(): number { return this.duracao; }
  getOrcamento(): number { return this.orcamento; }
  getPrazo(): Date { return new Date(this.prazo.getTime()); }
  getPapeisNecessarios(): Papel[] { return [...this.papeisNecessarios]; }
  getRestricoes(): Restricoes { return structuredClone(this.restricoes); }
  getEquipe(): Map<Papel, Profissional> { return new Map(this.equipe); }
  getObservadores(): readonly Observador[] { return [...this.observadores]; }

  aceitarVisitante(visitante: VisitanteProjeto): boolean {
    return visitante.visitarProjeto(this);
  }

  adicionarObservador(observador: Observador): void {
    if (!this.observadores.includes(observador)) this.observadores.push(observador);
  }

  removerObservador(observador: Observador): void {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  notificar(tipo: TipoEvento, papel?: Papel, profissional?: Profissional): void {
    const evento: EventoRecomendacao = {
      tipo,
      projetoId: this.id,
      genero: this.getGenero(),
      papel,
      profissional,
      quando: new Date(),
    };
    for (const o of [...this.observadores]) o.atualizar(evento);
  }

  aceitarRecomendacao(papel: Papel, profissional: Profissional): void {
    this.exigirPapel(papel);
    this.equipe.set(papel, profissional);
    this.notificar("RECOMENDACAO_ACEITA", papel, profissional);
  }

  substituirMembro(papel: Papel, profissional: Profissional): void {
    this.exigirPapel(papel);
    this.equipe.set(papel, profissional);
    this.notificar("MEMBRO_SUBSTITUIDO", papel, profissional);
  }

  solicitarReavaliacao(): void {
    this.notificar("REAVALIACAO_SOLICITADA");
  }

  private exigirPapel(papel: Papel): void {
    if (!this.papeisNecessarios.includes(papel)) {
      throw new Error(`O papel ${papel} não faz parte do projeto ${this.id} (${this.getGenero()})`);
    }
  }
}
