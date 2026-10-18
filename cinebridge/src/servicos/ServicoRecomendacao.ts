import { Projeto } from '../entities/Projeto';
import { PapelRequisito } from '../entities/PapelRequisito';
import { RepositorioProfissionaisPort } from '../domain/ports/RepositorioProfissionaisPort';
import { CircuitBreaker } from '../infra/resiliencia/CircuitBreaker';
import { SeletorEstrategia } from '../domain/estrategias/SeletorEstrategia';
import { ComposicaoEquipePadrao } from '../domain/orquestracao/ComposicaoEquipePadrao';
import { BarramentoEventosRecomendacao } from '../domain/notificacoes/BarramentoEventosRecomendacao';
import { logger } from '../utils/logger';
import type { ComposicaoEquipe } from '../domain/dtos';

export class ServicoRecomendacao {
  private readonly seletorEstrategia = new SeletorEstrategia();
  private ultimoPoolConhecido: Awaited<ReturnType<RepositorioProfissionaisPort['buscarAtivos']>> = [];

  constructor(
    private readonly repositorioProfissionais: RepositorioProfissionaisPort,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly barramento: BarramentoEventosRecomendacao,
  ) {}

  async gerarRecomendacoes(projeto: Projeto, papeis: PapelRequisito[]): Promise<ComposicaoEquipe> {
    const inicio = Date.now();

    const { valor: pool, usouFallback } = await this.circuitBreaker.executar(
      () => this.repositorioProfissionais.buscarAtivos(),
      () => this.ultimoPoolConhecido,
    );

    if (!usouFallback) {
      this.ultimoPoolConhecido = pool;
    } else {
      logger.warn('repositorio de profissionais indisponivel - recomendacao gerada com dados em cache', {
        projetoId: projeto.id,
        tamanhoPoolCache: pool.length,
      });
    }

    const estrategia = this.seletorEstrategia.resolver(projeto);
    const composer = new ComposicaoEquipePadrao(estrategia);
    const composicao = composer.compor(projeto, papeis, pool);
    composicao.parcial = usouFallback;

    this.barramento.emitirEvento('equipe_recomendada', { projetoId: projeto.id, composicao });

    logger.info('recomendacao de equipe gerada', {
      projetoId: projeto.id,
      estrategia: composicao.estrategiaUsada,
      duracaoMs: Date.now() - inicio,
      parcial: composicao.parcial,
    });

    return composicao;
  }

  async reavaliarEquipe(projeto: Projeto, papeis: PapelRequisito[], motivo: string): Promise<ComposicaoEquipe> {
    const composicao = await this.gerarRecomendacoes(projeto, papeis);
    this.barramento.emitirEvento('equipe_reavaliada', { projetoId: projeto.id, motivo, composicao });
    return composicao;
  }
}
