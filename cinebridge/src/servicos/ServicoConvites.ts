import { Convite } from '../entities/Convite';
import { Projeto } from '../entities/Projeto';
import { PapelRequisito } from '../entities/PapelRequisito';
import { BarramentoEventosRecomendacao } from '../domain/notificacoes/BarramentoEventosRecomendacao';
import { ServicoRecomendacao } from './ServicoRecomendacao';
import { logger } from '../utils/logger';
import type { ComposicaoEquipe } from '../domain/dtos';

export class ServicoConvites {
  constructor(
    private readonly servicoRecomendacao: ServicoRecomendacao,
    private readonly barramento: BarramentoEventosRecomendacao,
  ) {}

  async responder(convite: Convite, aceito: boolean): Promise<void> {
    convite.status = aceito ? 'aceito' : 'recusado';
    convite.respondidoEm = new Date();

    this.barramento.emitirEvento('convite_respondido', { convite, aceito });

    logger.info('convite respondido', { conviteId: convite.id, papel: convite.papel, aceito });
  }

  async substituirTitular(projeto: Projeto, papelAfetado: PapelRequisito): Promise<ComposicaoEquipe> {
    logger.info('substituicao de titular solicitada, recalculando apenas o papel afetado', {
      projetoId: projeto.id,
      papel: papelAfetado.papel,
    });
    return this.servicoRecomendacao.reavaliarEquipe(projeto, [papelAfetado], `substituicao do papel ${papelAfetado.papel}`);
  }

  async reavaliarEquipeCompleta(projeto: Projeto, papeis: PapelRequisito[], motivo: string): Promise<ComposicaoEquipe> {
    return this.servicoRecomendacao.reavaliarEquipe(projeto, papeis, motivo);
  }
}
