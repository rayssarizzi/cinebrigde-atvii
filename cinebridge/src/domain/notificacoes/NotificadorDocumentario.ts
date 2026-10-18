import type { EventoRecomendacao } from "../contratos";
import { NotificadorBase } from "./NotificadorBase";

export class NotificadorDocumentario extends NotificadorBase {
  protected formatar(e: EventoRecomendacao): string {
    return `[DOC] Projeto ${e.projetoId}: ${this.detalhe(e)}`;
  }
}
