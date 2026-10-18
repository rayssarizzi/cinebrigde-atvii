"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoPublicitario = void 0;
const contratos_1 = require("../contratos");
const Projeto_1 = require("./Projeto");
class ProjetoPublicitario extends Projeto_1.Projeto {
    marca;
    canais;
    constructor(dados = {}, marca = "", canais = []) {
        super("publicitario", {
            papeisNecessarios: [contratos_1.Papel.DIRETOR, contratos_1.Papel.REDATOR, contratos_1.Papel.DIRETOR_ARTE, contratos_1.Papel.EDITOR],
            ...dados,
        });
        this.marca = marca;
        this.canais = [...canais];
    }
    getMarca() { return this.marca; }
    getCanais() { return [...this.canais]; }
    ajustar(dados) {
        super.ajustar(dados);
        if (typeof dados.marca === "string")
            this.marca = dados.marca;
        if (Array.isArray(dados.canais))
            this.canais = [...dados.canais];
        return this;
    }
    clonar() {
        const c = new ProjetoPublicitario({}, this.marca, this.canais);
        this.copiarEstadoPara(c);
        return c;
    }
}
exports.ProjetoPublicitario = ProjetoPublicitario;
