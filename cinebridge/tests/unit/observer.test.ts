import { describe, expect, it, vi } from 'vitest';
import { BarramentoEventosRecomendacao } from '../../src/domain/notificacoes/BarramentoEventosRecomendacao';
import type { Observador } from '../../src/domain/notificacoes/Observador';

function criarObservadorEspiao(evento: string, nome: string): Observador & { chamadas: unknown[] } {
  const chamadas: unknown[] = [];
  return {
    nome,
    evento,
    chamadas,
    async notificar(payload) {
      chamadas.push(payload);
    },
  };
}

describe('BarramentoEventosRecomendacao', () => {
  it('notifica todos os observadores inscritos no mesmo evento, de forma independente', async () => {
    const barramento = new BarramentoEventosRecomendacao();
    const email = criarObservadorEspiao('equipe_recomendada', 'email');
    const mensageria = criarObservadorEspiao('equipe_recomendada', 'mensageria');
    const auditoria = criarObservadorEspiao('convite_respondido', 'auditoria');

    barramento.inscrever(email);
    barramento.inscrever(mensageria);
    barramento.inscrever(auditoria);

    barramento.emitirEvento('equipe_recomendada', { projetoId: 'p1' });
    await barramento.aguardarObservadoresPendentes();

    expect(email.chamadas).toEqual([{ projetoId: 'p1' }]);
    expect(mensageria.chamadas).toEqual([{ projetoId: 'p1' }]);
    expect(auditoria.chamadas).toHaveLength(0);
  });

  it('uma falha em um observador nao impede os demais de rodar nem propaga excecao', async () => {
    const barramento = new BarramentoEventosRecomendacao();
    const quebrado: Observador = {
      nome: 'quebrado',
      evento: 'equipe_recomendada',
      notificar: vi.fn().mockRejectedValue(new Error('falha simulada')),
    };
    const saudavel = criarObservadorEspiao('equipe_recomendada', 'saudavel');

    barramento.inscrever(quebrado);
    barramento.inscrever(saudavel);

    expect(() => barramento.emitirEvento('equipe_recomendada', { ok: true })).not.toThrow();
    await barramento.aguardarObservadoresPendentes();

    expect(saudavel.chamadas).toEqual([{ ok: true }]);
  });
});
