"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadorAnimacao = void 0;
const ProjetoAnimacao_1 = require("../projetos/ProjetoAnimacao");
const ValidadorBase_1 = require("./ValidadorBase");
class ValidadorAnimacao extends ValidadorBase_1.ValidadorBase {
    visitarProjeto(projeto) {
        if (!(projeto instanceof ProjetoAnimacao_1.ProjetoAnimacao))
            return false;
        return projeto.getOrcamento() > 0
            && projeto.getDuracao() > 0
            && projeto.getSoftwares().length > 0;
    }
    visitarProfissional(p) {
        return super.visitarProfissional(p) && p.nota >= 6;
    }
}
exports.ValidadorAnimacao = ValidadorAnimacao;
