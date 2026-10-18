import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { Profissional } from '../../entities/Profissional';
import { EstrategiaRecomendacao } from '../estrategias/EstrategiaRecomendacao';
import type { ComposicaoEquipe, PapelAlocado } from '../dtos';

const MAX_ALTERNATIVAS_POR_PAPEL = 3;

export abstract class ComposicaoEquipeTemplate {
  constructor(private readonly estrategia: EstrategiaRecomendacao) {}

  compor(projeto: Projeto, papeis: PapelRequisito[], poolBruto: Profissional[]): ComposicaoEquipe {
    this.validarRestricoesOrcamentarias(projeto, papeis, poolBruto);
    const pool = this.normalizarDadosEntrada(poolBruto, projeto);

    const papeisAlocados: PapelAlocado[] = papeis.map((papel) => {
      const ranqueados = this.estrategia.ranquear(papel, pool, projeto);
      return {
        papel: papel.papel,
        peso: Number(papel.peso),
        titular: ranqueados[0] ?? null,
        alternativas: ranqueados.slice(1, MAX_ALTERNATIVAS_POR_PAPEL + 1),
      };
    });

    const papeisProcessados = this.posProcessarRecomendacoes(papeisAlocados, pool);

    return {
      projetoId: projeto.id,
      estrategiaUsada: this.estrategia.nome,
      papeis: papeisProcessados,
      custoEstimadoTotal: papeisProcessados.reduce((total, p) => total + (p.titular?.precoEstimado ?? 0), 0),
      parcial: false,
      geradaEm: new Date().toISOString(),
    };
  }

  protected abstract validarRestricoesOrcamentarias(
    projeto: Projeto,
    papeis: PapelRequisito[],
    pool: Profissional[],
  ): void;

  protected abstract normalizarDadosEntrada(pool: Profissional[], projeto: Projeto): Profissional[];

  protected abstract posProcessarRecomendacoes(papeis: PapelAlocado[], pool: Profissional[]): PapelAlocado[];
}
