import { Profissional } from '../../entities/Profissional';

export interface RepositorioProfissionaisPort {
  buscarAtivos(): Promise<Profissional[]>;
  buscarPorId(id: string): Promise<Profissional | null>;
}
