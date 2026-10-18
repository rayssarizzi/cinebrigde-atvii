import type { EventoRecomendacao } from "../contratos";
import { NotificadorBase } from "./NotificadorBase";

export class NotificadorPublicitario extends NotificadorBase {
  protected formatar(e: EventoRecomendacao): string {
    return `[PUB] Campanha ${e.projetoId} | ${this.detalhe(e)}`;
  }
}
