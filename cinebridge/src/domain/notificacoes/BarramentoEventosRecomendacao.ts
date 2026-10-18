import { EventEmitter } from 'node:events';
import { logger } from '../../utils/logger';
import { Observador } from './Observador';

export class BarramentoEventosRecomendacao extends EventEmitter {
  private pendentes: Promise<void>[] = [];

  inscrever(observador: Observador): void {
    this.on(observador.evento, (payload: unknown) => {
      const execucao = observador.notificar(payload).catch((erro) => {
        logger.error(`observador "${observador.nome}" falhou ao processar evento "${observador.evento}"`, {
          erro: erro instanceof Error ? erro.message : String(erro),
        });
      });
      this.pendentes.push(execucao);
    });
  }

  emitirEvento<T>(evento: string, payload: T): void {
    this.emit(evento, payload);
  }

  async aguardarObservadoresPendentes(): Promise<void> {
    await Promise.allSettled(this.pendentes);
    this.pendentes = [];
  }
}
