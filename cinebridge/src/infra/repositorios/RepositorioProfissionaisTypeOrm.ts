import { DataSource } from 'typeorm';
import { Profissional } from '../../entities/Profissional';
import { RepositorioProfissionaisPort } from '../../domain/ports/RepositorioProfissionaisPort';
import { mapearVetorCompetencias } from '../../domain/estrategias/mapearVetorCompetencias';

export class RepositorioProfissionaisTypeOrm implements RepositorioProfissionaisPort {
  constructor(private readonly dataSource: DataSource) {}

  async buscarAtivos(): Promise<Profissional[]> {
    const repositorio = this.dataSource.getRepository(Profissional);
    const profissionais = await repositorio.find({
      where: { ativo: true },
      relations: { perfilCompetencias: { competencia: true }, avaliacoes: true },
    });
    return profissionais.map((p) => {
      p.vetorCompetencias = mapearVetorCompetencias(p);
      return p;
    });
  }

  async buscarPorId(id: string): Promise<Profissional | null> {
    const repositorio = this.dataSource.getRepository(Profissional);
    const profissional = await repositorio.findOne({
      where: { id },
      relations: { perfilCompetencias: { competencia: true }, avaliacoes: true },
    });
    if (profissional) profissional.vetorCompetencias = mapearVetorCompetencias(profissional);
    return profissional;
  }
}
