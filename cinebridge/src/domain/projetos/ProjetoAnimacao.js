"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoAnimacao = void 0;
const contratos_1 = require("../contratos");
const Projeto_1 = require("./Projeto");
class ProjetoAnimacao extends Projeto_1.Projeto {
    tecnica;
    softwares;
    constructor(dados = {}, tecnica = "3D", softwares = []) {
        super("animacao", {
            papeisNecessarios: [contratos_1.Papel.DIRETOR, contratos_1.Papel.ROTEIRISTA, contratos_1.Papel.ANIMADOR_3D, contratos_1.Papel.RIGGER, contratos_1.Papel.PRODUTOR],
            ...dados,
        });
        this.tecnica = tecnica;
        this.softwares = [...softwares];
    }
    getTecnica() { return this.tecnica; }
    getSoftwares() { return [...this.softwares]; }
    ajustar(dados) {
        super.ajustar(dados);
        if (dados.tecnica === "2D" || dados.tecnica === "3D")
            this.tecnica = dados.tecnica;
        if (Array.isArray(dados.softwares))
            this.softwares = [...dados.softwares];
        return this;
    }
    clonar() {
        const c = new ProjetoAnimacao({}, this.tecnica, this.softwares);
        this.copiarEstadoPara(c);
        return c;
    }
}
exports.ProjetoAnimacao = ProjetoAnimacao;
