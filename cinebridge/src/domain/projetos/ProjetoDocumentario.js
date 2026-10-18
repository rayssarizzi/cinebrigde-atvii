"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoDocumentario = void 0;
const contratos_1 = require("../contratos");
const Projeto_1 = require("./Projeto");
class ProjetoDocumentario extends Projeto_1.Projeto {
    tema;
    entrevistados;
    constructor(dados = {}, tema = "", entrevistados = []) {
        super("documentario", {
            papeisNecessarios: [contratos_1.Papel.DIRETOR, contratos_1.Papel.PESQUISADOR, contratos_1.Papel.EDITOR, contratos_1.Papel.PRODUTOR],
            ...dados,
        });
        this.tema = tema;
        this.entrevistados = [...entrevistados];
    }
    getTema() { return this.tema; }
    getEntrevistados() { return [...this.entrevistados]; }
    ajustar(dados) {
        super.ajustar(dados);
        if (typeof dados.tema === "string")
            this.tema = dados.tema;
        if (Array.isArray(dados.entrevistados))
            this.entrevistados = [...dados.entrevistados];
        return this;
    }
    clonar() {
        const c = new ProjetoDocumentario({}, this.tema, this.entrevistados);
        this.copiarEstadoPara(c);
        return c;
    }
}
exports.ProjetoDocumentario = ProjetoDocumentario;
