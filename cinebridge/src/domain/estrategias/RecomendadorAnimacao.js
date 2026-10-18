"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecomendadorAnimacao = void 0;
const ProjetoAnimacao_1 = require("../projetos/ProjetoAnimacao");
const RecomendadorBase_1 = require("./RecomendadorBase");
class RecomendadorAnimacao extends RecomendadorBase_1.RecomendadorBase {
    habilidadesChave(projeto) {
        const base = ["modelagem 3d", "rigging", "renderizacao"];
        return projeto instanceof ProjetoAnimacao_1.ProjetoAnimacao ? [...base, ...projeto.getSoftwares()] : base;
    }
}
exports.RecomendadorAnimacao = RecomendadorAnimacao;
