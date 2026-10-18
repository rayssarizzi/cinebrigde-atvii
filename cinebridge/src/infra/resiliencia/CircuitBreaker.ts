import { logger } from '../../utils/logger';

type Estado = 'fechado' | 'aberto' | 'meio_aberto';

export interface OpcoesCircuitBreaker {
  maxFalhasConsecutivas: number;
  tempoResetMs: number;
  nome: string;
}

export class CircuitBreaker {
  private estado: Estado = 'fechado';
  private falhasConsecutivas = 0;
  private abriuEm = 0;

  constructor(private readonly opcoes: OpcoesCircuitBreaker) {}

  async executar<T>(operacao: () => Promise<T>, fallback: () => T | Promise<T>): Promise<{ valor: T; usouFallback: boolean }> {
    if (this.estado === 'aberto') {
      const passouTempoDeReset = Date.now() - this.abriuEm >= this.opcoes.tempoResetMs;
      if (!passouTempoDeReset) {
        return { valor: await fallback(), usouFallback: true };
      }
      this.estado = 'meio_aberto';
    }

    try {
      const valor = await operacao();
      this.registrarSucesso();
      return { valor, usouFallback: false };
    } catch (erro) {
      this.registrarFalha(erro);
      return { valor: await fallback(), usouFallback: true };
    }
  }

  private registrarSucesso() {
    this.falhasConsecutivas = 0;
    if (this.estado !== 'fechado') {
      logger.info(`circuit breaker "${this.opcoes.nome}" restabelecido`);
    }
    this.estado = 'fechado';
  }

  private registrarFalha(erro: unknown) {
    this.falhasConsecutivas += 1;
    logger.warn(`falha na dependencia protegida por "${this.opcoes.nome}"`, {
      falhasConsecutivas: this.falhasConsecutivas,
      erro: erro instanceof Error ? erro.message : String(erro),
    });

    if (this.estado === 'meio_aberto' || this.falhasConsecutivas >= this.opcoes.maxFalhasConsecutivas) {
      this.estado = 'aberto';
      this.abriuEm = Date.now();
      logger.error(`circuit breaker "${this.opcoes.nome}" aberto - usando fallback ate reset`);
    }
  }

  obterEstado(): Estado {
    return this.estado;
  }
}
