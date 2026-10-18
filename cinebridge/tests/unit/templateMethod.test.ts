import { describe, expect, it } from 'vitest';
import { ComposicaoEquipePadrao } from '../../src/domain/orquestracao/ComposicaoEquipePadrao';
import { SimilaridadeCossenoEstrategia } from '../../src/domain/estrategias/SimilaridadeCossenoEstrategia';
import { RestricaoOrcamentariaError } from '../../src/domain/orquestracao/erros';
import { criarPapel, criarProfissional, criarProjeto } from '../fixtures/dadosFalsos';

describe('ComposicaoEquipePadrao (Template Method)', () => {
  it('lanca RestricaoOrcamentariaError quando nem o profissional mais barato do mercado cabe na fatia do papel', () => {
    const projeto = criarProjeto({ orcamentoTotal: 5_000 });
    const papelCaro = criarPapel({ papel: 'diretor', peso: 0.1 });
    const candidatoCaro = criarProfissional({ especialidades: ['diretor'], precoMinimo: 50_000, precoMaximo: 80_000 });

    const composer = new ComposicaoEquipePadrao(new SimilaridadeCossenoEstrategia());

    expect(() => composer.compor(projeto, [papelCaro], [candidatoCaro])).toThrow(RestricaoOrcamentariaError);
  });

  it('filtra profissionais de outra localizacao, exceto os marcados como remoto', () => {
    const projeto = criarProjeto({ localizacao: 'sao_paulo' });
    const papel = criarPapel({ papel: 'editor' });

    const localCorreto = criarProfissional({ especialidades: ['editor'], localizacao: 'sao_paulo' });
    const remoto = criarProfissional({ especialidades: ['editor'], localizacao: 'remoto' });
    const outraCidade = criarProfissional({ especialidades: ['editor'], localizacao: 'curitiba' });

    const composer = new ComposicaoEquipePadrao(new SimilaridadeCossenoEstrategia());
    const resultado = composer.compor(projeto, [papel], [localCorreto, remoto, outraCidade]);

    const idsConsiderados = [resultado.papeis[0].titular?.profissionalId, ...resultado.papeis[0].alternativas.map((a) => a.profissionalId)];
    expect(idsConsiderados).toContain(localCorreto.id);
    expect(idsConsiderados).toContain(remoto.id);
    expect(idsConsiderados).not.toContain(outraCidade.id);
  });

  it('nao permite que o mesmo profissional seja titular de dois papeis - o papel de menor peso cede', () => {
    const projeto = criarProjeto({ localizacao: 'sao_paulo' });
    const papelPrincipal = criarPapel({ papel: 'diretor', peso: 0.5 });
    const papelSecundario = criarPapel({ papel: 'editor', peso: 0.1 });

    const versatil = criarProfissional({ especialidades: ['diretor', 'editor'], localizacao: 'sao_paulo' });
    const somenteEditor = criarProfissional({ especialidades: ['editor'], localizacao: 'sao_paulo' });

    const composer = new ComposicaoEquipePadrao(new SimilaridadeCossenoEstrategia());
    const resultado = composer.compor(projeto, [papelPrincipal, papelSecundario], [versatil, somenteEditor]);

    const alocacaoDiretor = resultado.papeis.find((p) => p.papel === 'diretor');
    const alocacaoEditor = resultado.papeis.find((p) => p.papel === 'editor');

    expect(alocacaoDiretor?.titular?.profissionalId).toBe(versatil.id);
    expect(alocacaoEditor?.titular?.profissionalId).toBe(somenteEditor.id);
  });
});
