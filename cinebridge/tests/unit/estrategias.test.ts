import { describe, expect, it } from 'vitest';
import { SimilaridadeCossenoEstrategia } from '../../src/domain/estrategias/SimilaridadeCossenoEstrategia';
import { FiltragemColaborativaEstrategia } from '../../src/domain/estrategias/FiltragemColaborativaEstrategia';
import { RegrasOrcamentoEstrategia } from '../../src/domain/estrategias/RegrasOrcamentoEstrategia';
import { SeletorEstrategia } from '../../src/domain/estrategias/SeletorEstrategia';
import { criarAvaliacao, criarPapel, criarProfissional, criarProjeto } from '../fixtures/dadosFalsos';

describe('SimilaridadeCossenoEstrategia', () => {
  it('da pontuacao maior para quem tem o vetor de competencias mais parecido com o exigido', () => {
    const papel = criarPapel({ papel: 'diretor_fotografia', requisitosCompetencia: { luz: 0.9, camera: 0.8 } });

    const bemAlinhado = criarProfissional({
      especialidades: ['diretor_fotografia'],
      vetorCompetencias: { luz: 0.85, camera: 0.75 },
    });
    const poucoAlinhado = criarProfissional({
      especialidades: ['diretor_fotografia'],
      vetorCompetencias: { luz: 0.1, camera: 0.9 },
    });

    const ranqueados = new SimilaridadeCossenoEstrategia().ranquear(papel, [poucoAlinhado, bemAlinhado], criarProjeto());

    expect(ranqueados[0].profissionalId).toBe(bemAlinhado.id);
  });

  it('ignora profissionais que nao tem a especialidade exigida pelo papel', () => {
    const papel = criarPapel({ papel: 'sonoplasta' });
    const foraDaEspecialidade = criarProfissional({ especialidades: ['editor'] });

    const ranqueados = new SimilaridadeCossenoEstrategia().ranquear(papel, [foraDaEspecialidade], criarProjeto());

    expect(ranqueados).toHaveLength(0);
  });
});

describe('FiltragemColaborativaEstrategia', () => {
  it('privilegia quem tem historico melhor de avaliacoes', () => {
    const papel = criarPapel({ papel: 'editor' });

    const bemAvaliado = criarProfissional({
      especialidades: ['editor'],
      avaliacoes: [criarAvaliacao(5), criarAvaliacao(4.5)],
      projetosConcluidos: 15,
    });
    const iniciante = criarProfissional({
      especialidades: ['editor'],
      avaliacoes: [],
      projetosConcluidos: 1,
    });

    const ranqueados = new FiltragemColaborativaEstrategia().ranquear(papel, [iniciante, bemAvaliado], criarProjeto());

    expect(ranqueados[0].profissionalId).toBe(bemAvaliado.id);
  });
});

describe('RegrasOrcamentoEstrategia', () => {
  it('penaliza quem estoura a fatia de orcamento destinada ao papel', () => {
    const projeto = criarProjeto({ orcamentoTotal: 100_000 });
    const papel = criarPapel({ papel: 'roteirista', peso: 0.1 });

    const dentroDoOrcamento = criarProfissional({ especialidades: ['roteirista'], precoMinimo: 4000, precoMaximo: 6000 });
    const caro = criarProfissional({ especialidades: ['roteirista'], precoMinimo: 40_000, precoMaximo: 60_000 });

    const ranqueados = new RegrasOrcamentoEstrategia().ranquear(papel, [caro, dentroDoOrcamento], projeto);

    expect(ranqueados[0].profissionalId).toBe(dentroDoOrcamento.id);
  });
});

describe('SeletorEstrategia', () => {
  const seletor = new SeletorEstrategia();

  it('respeita a estrategia explicitamente escolhida pelo produtor', () => {
    const projeto = criarProjeto({ estrategiaPreferida: 'filtragem_colaborativa', orcamentoTotal: 500_000 });
    expect(seletor.resolver(projeto).nome).toBe('filtragem_colaborativa');
  });

  it('usa regras de orcamento automaticamente para projetos de baixo orcamento', () => {
    const projeto = criarProjeto({ estrategiaPreferida: 'auto', orcamentoTotal: 10_000 });
    expect(seletor.resolver(projeto).nome).toBe('regras_orcamento');
  });

  it('usa similaridade de cosseno como padrao para projetos com orcamento normal', () => {
    const projeto = criarProjeto({ estrategiaPreferida: 'auto', orcamentoTotal: 300_000 });
    expect(seletor.resolver(projeto).nome).toBe('similaridade_cosseno');
  });
});
