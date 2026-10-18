import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { Projeto } from '../entities/Projeto';
import { PapelRequisito } from '../entities/PapelRequisito';
import { Profissional } from '../entities/Profissional';
import { Competencia } from '../entities/Competencia';
import { PerfilCompetencia } from '../entities/PerfilCompetencia';
import { Avaliacao } from '../entities/Avaliacao';
import { Recomendacao } from '../entities/Recomendacao';
import { Convite } from '../entities/Convite';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.usuario,
  password: env.db.senha,
  database: env.db.banco,
  synchronize: env.nodeEnv !== 'production',
  logging: env.nodeEnv === 'development',
  entities: [Projeto, PapelRequisito, Profissional, Competencia, PerfilCompetencia, Avaliacao, Recomendacao, Convite],
  migrations: ['src/migrations/*.ts'],
});
