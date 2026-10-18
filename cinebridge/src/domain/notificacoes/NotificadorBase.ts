import type { EventoRecomendacao, Observador } from "../contratos";

export abstract class NotificadorBase implements Observador {
  readonly mensagens: string[] = [];
  protected abstract formatar(e: EventoRecomendacao): string;

  atualizar(evento: EventoRecomendacao): void {
    this.mensagens.push(this.formatar(evento));
  }

  protected detalhe(e: EventoRecomendacao): string {
    const quem = e.profissional ? ` ${e.profissional.nome}` : "";
    const papel = e.papel ? ` [${e.papel}]` : "";
    return `${e.tipo}${papel}${quem}`;
  }
}
