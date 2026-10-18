"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadorPublicitario = void 0;
const ProjetoPublicitario_1 = require("../projetos/ProjetoPublicitario");
const ValidadorBase_1 = require("./ValidadorBase");
class ValidadorPublicitario extends ValidadorBase_1.ValidadorBase {
    visitarProjeto(projeto) {
        if (!(projeto instanceof ProjetoPublicitario_1.ProjetoPublicitario))
            return false;
        return projeto.getOrcamento() > 0
            && projeto.getMarca().trim().length > 0
            && projeto.getDuracao() > 0 && projeto.getDuracao() <= 5
            && projeto.getPrazo().getTime() > Date.now();
    }
}
exports.ValidadorPublicitario = ValidadorPublicitario;
