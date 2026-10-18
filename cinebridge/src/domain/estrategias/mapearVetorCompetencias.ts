import { Profissional } from '../../entities/Profissional';

export function mapearVetorCompetencias(profissional: Profissional): Record<string, number> {
  const vetor: Record<string, number> = {};
  for (const perfil of profissional.perfilCompetencias ?? []) {
    vetor[perfil.competencia.id] = Number(perfil.nivel);
  }
  return vetor;
}
