"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prof = prof;
exports.banco = banco;
const contratos_1 = require("../../src/domain/contratos");
let n = 0;
function prof(nome, papeis, habilidades, custo = 1000, nota = 8, disponivel = true) {
    return { id: `p${++n}`, nome, papeis, habilidades, custo, nota, disponivel };
}
function banco() {
    return [
        prof("Ana Pesquisa", [contratos_1.Papel.PESQUISADOR, contratos_1.Papel.ROTEIRISTA], ["pesquisa", "entrevista", "roteiro documental"], 1500, 9),
        prof("Bruno Diretor", [contratos_1.Papel.DIRETOR], ["pesquisa", "branding", "modelagem 3d"], 3000, 8),
        prof("Carla Editora", [contratos_1.Papel.EDITOR], ["edicao", "roteiro documental"], 1800, 8),
        prof("Diego Produtor", [contratos_1.Papel.PRODUTOR], ["gestao"], 2000, 7),
        prof("Eva 3D", [contratos_1.Papel.ANIMADOR_3D], ["modelagem 3d", "renderizacao", "blender"], 2500, 9),
        prof("Fabio Rig", [contratos_1.Papel.RIGGER], ["rigging", "blender"], 2200, 8),
        prof("Gabi Roteiro", [contratos_1.Papel.ROTEIRISTA], ["roteiro"], 1700, 7),
        prof("Hugo Redator", [contratos_1.Papel.REDATOR], ["copywriting", "branding"], 1400, 9),
        prof("Iris Arte", [contratos_1.Papel.DIRETOR_ARTE], ["branding", "midia digital"], 1900, 8),
        prof("Joao Indisponivel", [contratos_1.Papel.REDATOR], ["copywriting", "branding", "midia digital"], 900, 10, false),
        prof("Kleber Fraco3D", [contratos_1.Papel.ANIMADOR_3D], ["modelagem 3d"], 800, 4),
    ];
}
