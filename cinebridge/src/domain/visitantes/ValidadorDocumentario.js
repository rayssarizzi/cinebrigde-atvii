"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadorDocumentario = void 0;
const ProjetoDocumentario_1 = require("../projetos/ProjetoDocumentario");
const ValidadorBase_1 = require("./ValidadorBase");
class ValidadorDocumentario extends ValidadorBase_1.ValidadorBase {
    visitarProjeto(projeto) {
        if (!(projeto instanceof ProjetoDocumentario_1.ProjetoDocumentario))
            return false;
        return projeto.getOrcamento() > 0
            && projeto.getTema().trim().length > 0
            && projeto.getEntrevistados().length > 0;
    }
}
exports.ValidadorDocumentario = ValidadorDocumentario;
