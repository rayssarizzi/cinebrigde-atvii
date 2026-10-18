export interface Observador<T = unknown> {
  readonly nome: string;
  readonly evento: string;
  notificar(payload: T): Promise<void>;
}
