import { describe, expect, it, vi } from 'vitest';
import { CircuitBreaker } from '../../src/infra/resiliencia/CircuitBreaker';

describe('CircuitBreaker', () => {
  it('usa o fallback quando a operacao falha, sem propagar a excecao', async () => {
    const cb = new CircuitBreaker({ nome: 'teste', maxFalhasConsecutivas: 3, tempoResetMs: 1000 });

    const { valor, usouFallback } = await cb.executar(
      () => Promise.reject(new Error('indisponivel')),
      () => 'valor-de-fallback',
    );

    expect(usouFallback).toBe(true);
    expect(valor).toBe('valor-de-fallback');
  });

  it('abre o circuito apos atingir o numero maximo de falhas consecutivas e passa a usar fallback direto', async () => {
    const cb = new CircuitBreaker({ nome: 'teste', maxFalhasConsecutivas: 2, tempoResetMs: 50 });
    const operacaoFalha = vi.fn().mockRejectedValue(new Error('indisponivel'));

    await cb.executar(operacaoFalha, () => 'fallback');
    await cb.executar(operacaoFalha, () => 'fallback');
    expect(cb.obterEstado()).toBe('aberto');

    await cb.executar(operacaoFalha, () => 'fallback');
    expect(operacaoFalha).toHaveBeenCalledTimes(2);
  });

  it('volta a chamar a operacao real depois do tempo de reset (half-open) e fecha se ela funcionar', async () => {
    const cb = new CircuitBreaker({ nome: 'teste', maxFalhasConsecutivas: 1, tempoResetMs: 10 });
    const operacao = vi.fn().mockRejectedValueOnce(new Error('indisponivel')).mockResolvedValueOnce('valor-real');

    await cb.executar(operacao, () => 'fallback');
    expect(cb.obterEstado()).toBe('aberto');

    await new Promise((resolve) => setTimeout(resolve, 20));

    const { valor, usouFallback } = await cb.executar(operacao, () => 'fallback');
    expect(usouFallback).toBe(false);
    expect(valor).toBe('valor-real');
    expect(cb.obterEstado()).toBe('fechado');
  });
});
