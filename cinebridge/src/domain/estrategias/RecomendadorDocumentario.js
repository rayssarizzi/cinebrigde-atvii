"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecomendadorDocumentario = void 0;
const RecomendadorBase_1 = require("./RecomendadorBase");
class RecomendadorDocumentario extends RecomendadorBase_1.RecomendadorBase {
    habilidadesChave() {
        return ["pesquisa", "entrevista", "roteiro documental", "edicao"];
    }
}
exports.RecomendadorDocumentario = RecomendadorDocumentario;
