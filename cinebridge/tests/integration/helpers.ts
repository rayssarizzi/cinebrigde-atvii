import { Papel } from "../../src/domain/contratos";
import type { Profissional } from "../../src/domain/contratos";

let n = 0;
export function prof(
  nome: string, papeis: Papel[], habilidades: string[],
  custo = 1000, nota = 8, disponivel = true,
): Profissional {
  return { id: `p${++n}`, nome, papeis, habilidades, custo, nota, disponivel };
}

export function banco(): Profissional[] {
  return [
    prof("Ana Pesquisa", [Papel.PESQUISADOR, Papel.ROTEIRISTA], ["pesquisa", "entrevista", "roteiro documental"], 1500, 9),
    prof("Bruno Diretor", [Papel.DIRETOR], ["pesquisa", "branding", "modelagem 3d"], 3000, 8),
    prof("Carla Editora", [Papel.EDITOR], ["edicao", "roteiro documental"], 1800, 8),
    prof("Diego Produtor", [Papel.PRODUTOR], ["gestao"], 2000, 7),
    prof("Eva 3D", [Papel.ANIMADOR_3D], ["modelagem 3d", "renderizacao", "blender"], 2500, 9),
    prof("Fabio Rig", [Papel.RIGGER], ["rigging", "blender"], 2200, 8),
    prof("Gabi Roteiro", [Papel.ROTEIRISTA], ["roteiro"], 1700, 7),
    prof("Hugo Redator", [Papel.REDATOR], ["copywriting", "branding"], 1400, 9),
    prof("Iris Arte", [Papel.DIRETOR_ARTE], ["branding", "midia digital"], 1900, 8),
    prof("Joao Indisponivel", [Papel.REDATOR], ["copywriting", "branding", "midia digital"], 900, 10, false),
    prof("Kleber Fraco3D", [Papel.ANIMADOR_3D], ["modelagem 3d"], 800, 4),
  ];
}
