import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { Profissional } from '../../entities/Profissional';
import { ComposicaoEquipeTemplate } from './ComposicaoEquipeTemplate';
import { RestricaoOrcamentariaError } from './erros';
import { precoEstimadoDoProfissional } from '../estrategias/EstrategiaRecomendacao';
import type { PapelAlocado } from '../dtos';

export class ComposicaoEquipePadrao extends ComposicaoEquipeTemplate {
  protected validarRestricoesOrcamentarias(projeto: Projeto, papeis: PapelRequisito[], pool: Profissional[]): void {
    for (const papel of papeis) {
      const candidatosDoPapel = pool.filter((p) => p.especialidades.includes(papel.papel));
      if (candidatosDoPapel.length === 0) continue;

      const maisBarato = Math.min(...candidatosDoPapel.map(precoEstimadoDoProfissional));
      const fatiaDisponivel = Number(projeto.orcamentoTotal) * Number(papel.peso);

      if (maisBarato > fatiaDisponivel * 1.5) {
        throw new RestricaoOrcamentariaError(
          `orcamento insuficiente para o papel "${papel.papel}": minimo de mercado R$ ${maisBarato.toFixed(2)}, fatia disponivel R$ ${fatiaDisponivel.toFixed(2)}`,
        );
      }
    }
  }

  protected normalizarDadosEntrada(pool: Profissional[], projeto: Projeto): Profissional[] {
    const inicioProjeto = new Date();
    const fimProjeto = new Date(projeto.dataEntrega);

    return pool.filter((profissional) => {
      if (!profissional.ativo) return false;
      if (!profissional.estaDisponivelEntre(inicioProjeto, fimProjeto)) return false;

      const mesmaLocalizacao =
        profissional.localizacao.toLowerCase() === projeto.localizacao.toLowerCase() ||
        profissional.localizacao.toLowerCase() === 'remoto';

      return mesmaLocalizacao;
    });
  }

  protected posProcessarRecomendacoes(papeis: PapelAlocado[], _pool: Profissional[]): PapelAlocado[] {
    const ordenados = [...papeis].sort((a, b) => b.peso - a.peso);
    const usados = new Set<string>();

    for (const papel of ordenados) {
      if (papel.titular && usados.has(papel.titular.profissionalId)) {
        const candidatosLivres = papel.alternativas.filter((alt) => !usados.has(alt.profissionalId));
        papel.titular = candidatosLivres[0] ?? null;
        papel.alternativas = candidatosLivres.slice(1);
      }
      if (papel.titular) usados.add(papel.titular.profissionalId);
    }

    return papeis;
  }
}
