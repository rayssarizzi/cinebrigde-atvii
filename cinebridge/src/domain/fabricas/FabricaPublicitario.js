"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricaPublicitario = void 0;
const ProjetoPublicitario_1 = require("../projetos/ProjetoPublicitario");
const RecomendadorPublicitario_1 = require("../estrategias/RecomendadorPublicitario");
const NotificadorPublicitario_1 = require("../notificacoes/NotificadorPublicitario");
const ValidadorPublicitario_1 = require("../visitantes/ValidadorPublicitario");
const FabricaProjeto_1 = require("./FabricaProjeto");
class FabricaPublicitario extends FabricaProjeto_1.FabricaProjeto {
    constructor(prototipo = new ProjetoPublicitario_1.ProjetoPublicitario()) {
        super(prototipo);
    }
    criarValidador() { return new ValidadorPublicitario_1.ValidadorPublicitario(); }
    criarRecomendador() { return new RecomendadorPublicitario_1.RecomendadorPublicitario(); }
    criarNotificador() { return new NotificadorPublicitario_1.NotificadorPublicitario(); }
}
exports.FabricaPublicitario = FabricaPublicitario;
