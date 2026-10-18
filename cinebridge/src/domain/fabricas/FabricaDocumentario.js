"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricaDocumentario = void 0;
const ProjetoDocumentario_1 = require("../projetos/ProjetoDocumentario");
const RecomendadorDocumentario_1 = require("../estrategias/RecomendadorDocumentario");
const NotificadorDocumentario_1 = require("../notificacoes/NotificadorDocumentario");
const ValidadorDocumentario_1 = require("../visitantes/ValidadorDocumentario");
const FabricaProjeto_1 = require("./FabricaProjeto");
class FabricaDocumentario extends FabricaProjeto_1.FabricaProjeto {
    constructor(prototipo = new ProjetoDocumentario_1.ProjetoDocumentario()) {
        super(prototipo);
    }
    criarValidador() { return new ValidadorDocumentario_1.ValidadorDocumentario(); }
    criarRecomendador() { return new RecomendadorDocumentario_1.RecomendadorDocumentario(); }
    criarNotificador() { return new NotificadorDocumentario_1.NotificadorDocumentario(); }
}
exports.FabricaDocumentario = FabricaDocumentario;
