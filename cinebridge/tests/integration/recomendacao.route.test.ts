import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { construirApp } from '../../src/http/app';
import { RepositorioProfissionaisFalso, criarProfissional } from '../fixtures/dadosFalsos';
import type { CriarProjetoDTO } from '../../src/domain/dtos';

function corpoDeProjetoValido(): CriarProjetoDTO {
  const daquiUmMes = new Date();
  daquiUmMes.setMonth(daquiUmMes.getMonth() + 1);

  return {
    genero: 'ficcao_urbana',
    duracaoEstimadaMinutos: 100,
    orcamentoTotal: 300_000,
    dataEntrega: daquiUmMes.toISOString().slice(0, 10),
    tipoCaptacao: 'ficcao',
    localizacao: 'sao_paulo',
    papeis: [
      { papel: 'diretor', peso: 0.4 },
      { papel: 'editor', peso: 0.2 },
    ],
  };
}

describe('POST /projetos/recomendacoes', () => {
  let app: FastifyInstance;
  let repositorio: RepositorioProfissionaisFalso;

  beforeEach(() => {
    repositorio = new RepositorioProfissionaisFalso([
      criarProfissional({ nome: 'Diretora A', especialidades: ['diretor'], localizacao: 'sao_paulo' }),
      criarProfissional({ nome: 'Editor B', especialidades: ['editor'], localizacao: 'sao_paulo' }),
    ]);
    app = construirApp(repositorio);
  });

  afterEach(async () => {
    await app.close();
  });

  it('retorna 200 com a equipe recomendada, validacao e relatorio quando tudo corre bem', async () => {
    const resposta = await app.inject({ method: 'POST', url: '/projetos/recomendacoes', payload: corpoDeProjetoValido() });

    expect(resposta.statusCode).toBe(200);
    const corpo = resposta.json();
    expect(corpo.composicao.papeis).toHaveLength(2);
    expect(corpo.validacao.valido).toBe(true);
    expect(corpo.relatorio.linhas).toHaveLength(2);
    expect(corpo.composicao.parcial).toBe(false);
  });

  it('retorna 400 quando o projeto nao informa nenhum papel', async () => {
    const payload = { ...corpoDeProjetoValido(), papeis: [] };
    const resposta = await app.inject({ method: 'POST', url: '/projetos/recomendacoes', payload });

    expect(resposta.statusCode).toBe(400);
  });

  it('responde com fallback (206, parcial=true) quando o repositorio de profissionais esta indisponivel', async () => {
    await app.inject({ method: 'POST', url: '/projetos/recomendacoes', payload: corpoDeProjetoValido() });

    repositorio.configurarFalhas(1);
    const resposta = await app.inject({ method: 'POST', url: '/projetos/recomendacoes', payload: corpoDeProjetoValido() });

    expect(resposta.statusCode).toBe(206);
    expect(resposta.json().composicao.parcial).toBe(true);
  });

  it('retorna 422 quando o orcamento e claramente incompativel com o mercado', async () => {
    repositorio.substituirProfissionais([
      criarProfissional({ nome: 'Diretor Caro', especialidades: ['diretor'], precoMinimo: 200_000, precoMaximo: 300_000, localizacao: 'sao_paulo' }),
    ]);

    const payload = { ...corpoDeProjetoValido(), orcamentoTotal: 5_000, papeis: [{ papel: 'diretor', peso: 0.1 }] };
    const resposta = await app.inject({ method: 'POST', url: '/projetos/recomendacoes', payload });

    expect(resposta.statusCode).toBe(422);
  });
});
