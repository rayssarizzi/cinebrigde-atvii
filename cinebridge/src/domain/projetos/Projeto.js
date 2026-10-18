"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projeto = void 0;
const node_crypto_1 = require("node:crypto");
class Projeto {
    id;
    genero;
    duracao;
    orcamento;
    prazo;
    papeisNecessarios;
    restricoes;
    equipe = new Map();
    observadores = [];
    constructor(genero, dados = {}) {
        this.genero = genero;
        this.id = (0, node_crypto_1.randomUUID)();
        this.duracao = 0;
        this.orcamento = 0;
        this.prazo = new Date();
        this.papeisNecessarios = [];
        this.restricoes = {};
        this.aplicarDadosBase(dados);
    }
    copiarEstadoPara(destino) {
        destino.id = this.id;
        destino.duracao = this.duracao;
        destino.orcamento = this.orcamento;
        destino.prazo = new Date(this.prazo.getTime());
        destino.papeisNecessarios = [...this.papeisNecessarios];
        destino.restricoes = structuredClone(this.restricoes);
        destino.equipe = new Map([...this.equipe].map(([papel, p]) => [papel, structuredClone(p)]));
        destino.observadores = [];
    }
    ajustar(dados) {
        this.aplicarDadosBase(dados);
        return this;
    }
    aplicarDadosBase(dados) {
        if (typeof dados.id === "string")
            this.id = dados.id;
        if (typeof dados.duracao === "number")
            this.duracao = dados.duracao;
        if (typeof dados.orcamento === "number")
            this.orcamento = dados.orcamento;
        if (dados.prazo instanceof Date)
            this.prazo = new Date(dados.prazo.getTime());
        if (Array.isArray(dados.papeisNecessarios))
            this.papeisNecessarios = [...dados.papeisNecessarios];
        if (dados.restricoes && typeof dados.restricoes === "object") {
            this.restricoes = structuredClone(dados.restricoes);
        }
    }
    getId() { return this.id; }
    getGenero() { return this.genero; }
    getDuracao() { return this.duracao; }
    getOrcamento() { return this.orcamento; }
    getPrazo() { return new Date(this.prazo.getTime()); }
    getPapeisNecessarios() { return [...this.papeisNecessarios]; }
    getRestricoes() { return structuredClone(this.restricoes); }
    getEquipe() { return new Map(this.equipe); }
    getObservadores() { return [...this.observadores]; }
    aceitarVisitante(visitante) {
        return visitante.visitarProjeto(this);
    }
    adicionarObservador(observador) {
        if (!this.observadores.includes(observador))
            this.observadores.push(observador);
    }
    removerObservador(observador) {
        this.observadores = this.observadores.filter((o) => o !== observador);
    }
    notificar(tipo, papel, profissional) {
        const evento = {
            tipo,
            projetoId: this.id,
            genero: this.getGenero(),
            papel,
            profissional,
            quando: new Date(),
        };
        for (const o of [...this.observadores])
            o.atualizar(evento);
    }
    aceitarRecomendacao(papel, profissional) {
        this.exigirPapel(papel);
        this.equipe.set(papel, profissional);
        this.notificar("RECOMENDACAO_ACEITA", papel, profissional);
    }
    substituirMembro(papel, profissional) {
        this.exigirPapel(papel);
        this.equipe.set(papel, profissional);
        this.notificar("MEMBRO_SUBSTITUIDO", papel, profissional);
    }
    solicitarReavaliacao() {
        this.notificar("REAVALIACAO_SOLICITADA");
    }
    exigirPapel(papel) {
        if (!this.papeisNecessarios.includes(papel)) {
            throw new Error(`O papel ${papel} não faz parte do projeto ${this.id} (${this.getGenero()})`);
        }
    }
}
exports.Projeto = Projeto;
