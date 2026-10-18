import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { RepositorioProfissionaisTypeOrm } from './infra/repositorios/RepositorioProfissionaisTypeOrm';
import { construirApp } from './http/app';
import { env } from './config/env';
import { logger } from './utils/logger';

async function principal() {
  await AppDataSource.initialize();
  logger.info('conexao com o postgres estabelecida');

  const repositorioProfissionais = new RepositorioProfissionaisTypeOrm(AppDataSource);
  const app = construirApp(repositorioProfissionais);

  await app.listen({ port: env.porta, host: '0.0.0.0' });
  logger.info(`microsservico de recomendacao ouvindo na porta ${env.porta}`);
}

principal().catch((erro) => {
  logger.error('falha ao iniciar o microsservico', { erro: erro instanceof Error ? erro.message : String(erro) });
  process.exit(1);
});
