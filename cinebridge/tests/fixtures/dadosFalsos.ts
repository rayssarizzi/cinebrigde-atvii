import { randomUUID } from 'node:crypto';
import { Profissional } from '../../src/entities/Profissional';
import { Avaliacao } from '../../src/entities/Avaliacao';
import { Projeto } from '../../src/entities/Projeto';
import { PapelRequisito } from '../../src/entities/PapelRequisito';
import type { RepositorioProfissionaisPort } from '../../src/domain/ports/RepositorioProfissionaisPort';

export function criarAvaliacao(nota: number): Avaliacao {
  const avaliacao = new Avaliacao();
  avaliacao.nota = nota;
  return avaliacao;
}

export function criarProfissional(overrides: Partial<Profissional> = {}): Profissional {
  const profissional = new Profissional();
  profissional.id = overrides.id ?? randomUUID();
  profissional.nome = overrides.nome ?? 'Profissional de teste';
  profissional.especialidades = overrides.especialidades ?? ['diretor'];
  profissional.precoMinimo = overrides.precoMinimo ?? 1000;
  profissional.precoMaximo = overrides.precoMaximo ?? 2000;
  profissional.localizacao = overrides.localizacao ?? 'sao_paulo';
  profissional.ativo = overrides.ativo ?? true;
  profissional.bloqueiosAgenda = overrides.bloqueiosAgenda ?? [];
  profissional.projetosConcluidos = overrides.projetosConcluidos ?? 5;
  profissional.perfilCompetencias = overrides.perfilCompetencias ?? [];
  profissional.avaliacoes = overrides.avaliacoes ?? [];
  profissional.vetorCompetencias = overrides.vetorCompetencias ?? {};
  return profissional;
}

export function criarPapel(overrides: Partial<PapelRequisito> = {}): PapelRequisito {
  const papel = new PapelRequisito();
  papel.papel = overrides.papel ?? 'diretor';
  papel.peso = overrides.peso ?? 0.3;
  papel.requisitosCompetencia = overrides.requisitosCompetencia ?? {};
  return papel;
}

export function criarProjeto(overrides: Partial<Projeto> = {}): Projeto {
  const daquiUmMes = new Date();
  daquiUmMes.setMonth(daquiUmMes.getMonth() + 1);

  const projeto = new Projeto();
  projeto.id = overrides.id ?? randomUUID();
  projeto.genero = overrides.genero ?? 'documentario_ambiental';
  projeto.duracaoEstimadaMinutos = overrides.duracaoEstimadaMinutos ?? 90;
  projeto.orcamentoTotal = overrides.orcamentoTotal ?? 200_000;
  projeto.dataEntrega = overrides.dataEntrega ?? daquiUmMes.toISOString().slice(0, 10);
  projeto.tipoCaptacao = overrides.tipoCaptacao ?? 'documentario';
  projeto.localizacao = overrides.localizacao ?? 'sao_paulo';
  projeto.estrategiaPreferida = overrides.estrategiaPreferida ?? 'auto';
  projeto.papeisRequisito = overrides.papeisRequisito ?? [];
  return projeto;
}

export class RepositorioProfissionaisFalso implements RepositorioProfissionaisPort {
  private falhasRestantes = 0;

  constructor(private profissionais: Profissional[] = []) {}

  configurarFalhas(quantidade: number) {
    this.falhasRestantes = quantidade;
  }

  substituirProfissionais(profissionais: Profissional[]) {
    this.profissionais = profissionais;
  }

  async buscarAtivos(): Promise<Profissional[]> {
    if (this.falhasRestantes > 0) {
      this.falhasRestantes -= 1;
      throw new Error('repositorio de profissionais indisponivel (simulado)');
    }
    return this.profissionais;
  }

  async buscarPorId(id: string): Promise<Profissional | null> {
    return this.profissionais.find((p) => p.id === id) ?? null;
  }
}
