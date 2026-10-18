import Fastify, { type FastifyInstance } from 'fastify';
import { RepositorioProfissionaisPort } from '../domain/ports/RepositorioProfissionaisPort';
import { CircuitBreaker } from '../infra/resiliencia/CircuitBreaker';
import { BarramentoEventosRecomendacao } from '../domain/notificacoes/BarramentoEventosRecomendacao';
import { NotificadorEmail } from '../domain/notificacoes/NotificadorEmail';
import { NotificadorMensagensInternas } from '../domain/notificacoes/NotificadorMensagensInternas';
import { RegistradorAuditoria } from '../domain/notificacoes/RegistradorAuditoria';
import { ServicoRecomendacao } from '../servicos/ServicoRecomendacao';
import { ServicoConvites } from '../servicos/ServicoConvites';
import { registrarRotasRecomendacao } from './rotas/recomendacao.routes';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export function construirApp(repositorioProfissionais: RepositorioProfissionaisPort): FastifyInstance {
  const app = Fastify({ logger: false });

  const circuitBreaker = new CircuitBreaker({
    nome: 'repositorio-profissionais',
    maxFalhasConsecutivas: env.circuitBreaker.maxFalhas,
    tempoResetMs: env.circuitBreaker.resetMs,
  });

  const barramento = new BarramentoEventosRecomendacao();
  barramento.inscrever(new NotificadorEmail());
  barramento.inscrever(new NotificadorMensagensInternas());
  barramento.inscrever(new RegistradorAuditoria('equipe_recomendada'));
  barramento.inscrever(new RegistradorAuditoria('convite_respondido'));
  barramento.inscrever(new RegistradorAuditoria('equipe_reavaliada'));

  const servicoRecomendacao = new ServicoRecomendacao(repositorioProfissionais, circuitBreaker, barramento);
  const servicoConvites = new ServicoConvites(servicoRecomendacao, barramento);

  app.addHook('onResponse', (requisicao, resposta, done) => {
    logger.info('requisicao processada', {
      metodo: requisicao.method,
      rota: requisicao.url,
      status: resposta.statusCode,
      duracaoMs: resposta.elapsedTime,
    });
    done();
  });

  app.setErrorHandler((erro, _requisicao, resposta) => {
    logger.error('erro nao tratado na requisicao', { erro: erro.message });
    resposta.status(500).send({ erro: 'erro interno ao processar a solicitacao' });
  });

  registrarRotasRecomendacao(app, servicoRecomendacao, servicoConvites);

  app.get('/saude', async () => ({ status: 'ok', circuito: circuitBreaker.obterEstado() }));

  return app;
}
