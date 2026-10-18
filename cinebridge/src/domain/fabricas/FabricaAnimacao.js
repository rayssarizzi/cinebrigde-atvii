"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricaAnimacao = void 0;
const ProjetoAnimacao_1 = require("../projetos/ProjetoAnimacao");
const RecomendadorAnimacao_1 = require("../estrategias/RecomendadorAnimacao");
const NotificadorAnimacao_1 = require("../notificacoes/NotificadorAnimacao");
const ValidadorAnimacao_1 = require("../visitantes/ValidadorAnimacao");
const FabricaProjeto_1 = require("./FabricaProjeto");
class FabricaAnimacao extends FabricaProjeto_1.FabricaProjeto {
    constructor(prototipo = new ProjetoAnimacao_1.ProjetoAnimacao()) {
        super(prototipo);
    }
    criarValidador() { return new ValidadorAnimacao_1.ValidadorAnimacao(); }
    criarRecomendador() { return new RecomendadorAnimacao_1.RecomendadorAnimacao(); }
    criarNotificador() { return new NotificadorAnimacao_1.NotificadorAnimacao(); }
}
exports.FabricaAnimacao = FabricaAnimacao;
