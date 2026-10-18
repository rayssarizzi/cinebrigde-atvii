export class RestricaoOrcamentariaError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'RestricaoOrcamentariaError';
  }
}
