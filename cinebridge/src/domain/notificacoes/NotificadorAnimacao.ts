import type { EventoRecomendacao } from "../contratos";
import { NotificadorBase } from "./NotificadorBase";

export class NotificadorAnimacao extends NotificadorBase {
  protected formatar(e: EventoRecomendacao): string {
    return `[ANIM] Pipeline ${e.projetoId} -> ${this.detalhe(e)}`;
  }
}
