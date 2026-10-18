import { Observador } from './Observador';
import { logger } from '../../utils/logger';
import type { PayloadEquipeRecomendada } from './eventos';

export class NotificadorEmail implements Observador<PayloadEquipeRecomendada> {
  readonly nome = 'notificador_email';
  readonly evento = 'equipe_recomendada';

  async notificar(payload: PayloadEquipeRecomendada): Promise<void> {
    const titulares = payload.composicao.papeis.filter((p) => p.titular);
    for (const papel of titulares) {
      logger.info('e-mail de convite enviado', {
        projetoId: payload.projetoId,
        papel: papel.papel,
        profissionalId: papel.titular!.profissionalId,
      });
    }
  }
}
