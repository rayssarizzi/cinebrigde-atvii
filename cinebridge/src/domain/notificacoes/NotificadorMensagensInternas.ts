import { Observador } from './Observador';
import { logger } from '../../utils/logger';
import type { PayloadEquipeRecomendada } from './eventos';

export class NotificadorMensagensInternas implements Observador<PayloadEquipeRecomendada> {
  readonly nome = 'notificador_mensagens_internas';
  readonly evento = 'equipe_recomendada';

  async notificar(payload: PayloadEquipeRecomendada): Promise<void> {
    logger.info('notificacao interna publicada no feed do produtor', {
      projetoId: payload.projetoId,
      totalPapeis: payload.composicao.papeis.length,
    });
  }
}
