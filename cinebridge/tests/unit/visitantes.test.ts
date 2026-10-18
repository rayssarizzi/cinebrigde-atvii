import { describe, expect, it } from 'vitest';
import { ComposicaoVisitavel } from '../../src/domain/visitantes/ComposicaoVisitavel';
import { ValidadorConsistenciaVisitante } from '../../src/domain/visitantes/ValidadorConsistenciaVisitante';
import { PontuacaoCompatibilidadeVisitante } from '../../src/domain/visitantes/PontuacaoCompatibilidadeVisitante';
import { GeradorRelatorioVisitante } from '../../src/domain/visitantes/GeradorRelatorioVisitante';
import type { ComposicaoEquipe } from '../../src/domain/dtos';

function composicaoDeExemplo(): ComposicaoEquipe {
  return {
    projetoId: 'proj-1',
    estrategiaUsada: 'similaridade_cosseno',
    custoEstimadoTotal: 15000,
    parcial: false,
    geradaEm: new Date().toISOString(),
    papeis: [
      {
        papel: 'diretor',
        peso: 0.6,
        titular: { profissionalId: 'a', nome: 'Ana', papel: 'diretor', pontuacao: 0.9, precoEstimado: 10000 },
        alternativas: [],
      },
      {
        papel: 'editor',
        peso: 0.4,
        titular: null,
        alternativas: [],
      },
    ],
  };
}

describe('ValidadorConsistenciaVisitante', () => {
  it('identifica papeis sem titular como inconsistencia', () => {
    const resultado = new ComposicaoVisitavel(composicaoDeExemplo()).aceitar(new ValidadorConsistenciaVisitante());

    expect(resultado.valido).toBe(false);
    expect(resultado.papeisSemTitular).toEqual(['editor']);
  });
});

describe('PontuacaoCompatibilidadeVisitante', () => {
  it('calcula a media ponderada pelos pesos dos papeis, tratando papel sem titular como pontuacao zero', () => {
    const nota = new ComposicaoVisitavel(composicaoDeExemplo()).aceitar(new PontuacaoCompatibilidadeVisitante());
    expect(nota).toBeCloseTo(0.54, 4);
  });
});

describe('GeradorRelatorioVisitante', () => {
  it('gera uma linha por papel e preserva os metadados da composicao', () => {
    const relatorio = new ComposicaoVisitavel(composicaoDeExemplo()).aceitar(new GeradorRelatorioVisitante());

    expect(relatorio.linhas).toHaveLength(2);
    expect(relatorio.linhas[0]).toContain('Ana');
    expect(relatorio.linhas[1]).toContain('nenhum candidato disponivel');
    expect(relatorio.projetoId).toBe('proj-1');
    expect(relatorio.custoEstimadoTotal).toBe(15000);
  });
});
