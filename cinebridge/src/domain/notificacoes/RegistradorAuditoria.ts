import { Observador } from './Observador';
import { logger } from '../../utils/logger';

export class RegistradorAuditoria implements Observador {
  readonly nome = 'registrador_auditoria';

  constructor(readonly evento: string) {}

  async notificar(payload: unknown): Promise<void> {
    logger.audit(`evento "${this.evento}" auditado`, { payload });
  }
}
