"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fabricasPadrao = fabricasPadrao;
exports.criarSistemaRecomendacao = criarSistemaRecomendacao;
const FabricaAnimacao_1 = require("../domain/fabricas/FabricaAnimacao");
const FabricaDocumentario_1 = require("../domain/fabricas/FabricaDocumentario");
const FabricaPublicitario_1 = require("../domain/fabricas/FabricaPublicitario");
const SistemaRecomendacao_1 = require("../servicos/SistemaRecomendacao");
function fabricasPadrao() {
    return [new FabricaDocumentario_1.FabricaDocumentario(), new FabricaAnimacao_1.FabricaAnimacao(), new FabricaPublicitario_1.FabricaPublicitario()];
}
function criarSistemaRecomendacao() {
    return new SistemaRecomendacao_1.SistemaRecomendacao(fabricasPadrao());
}
