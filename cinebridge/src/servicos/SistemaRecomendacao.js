"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneroNaoSuportadoError = exports.SistemaRecomendacao = void 0;
const NotificadorBase_1 = require("../domain/notificacoes/NotificadorBase");
const OrquestradorPadrao_1 = require("../domain/orquestracao/OrquestradorPadrao");
class SistemaRecomendacao {
    criarOrquestrador;
    fabricas = new Map();
    constructor(fabricas, criarOrquestrador = (f, c) => new OrquestradorPadrao_1.OrquestradorPadrao(f, c)) {
        this.criarOrquestrador = criarOrquestrador;
        fabricas.forEach((f) => this.registrarFabrica(f));
    }
    registrarFabrica(fabrica) {
        this.fabricas.set(fabrica.genero, fabrica);
    }
    generosSuportados() {
        return [...this.fabricas.keys()];
    }
    recomendar(s) {
        const fabrica = this.fabricas.get(s.genero);
        if (!fabrica) {
            throw new GeneroNaoSuportadoError(s.genero, this.generosSuportados());
        }
        const projeto = fabrica.criarProjeto(s.dados);
        const equipe = this.criarOrquestrador(fabrica, s.profissionais).orquestrar(projeto);
        const notificacoes = projeto
            .getObservadores()
            .flatMap((o) => (o instanceof NotificadorBase_1.NotificadorBase ? o.mensagens : []));
        return { projeto, equipe, notificacoes };
    }
}
exports.SistemaRecomendacao = SistemaRecomendacao;
class GeneroNaoSuportadoError extends Error {
    genero;
    suportados;
    constructor(genero, suportados) {
        super(`Gênero não suportado: "${genero}". Suportados: ${suportados.join(", ")}`);
        this.genero = genero;
        this.suportados = suportados;
        this.name = "GeneroNaoSuportadoError";
    }
}
exports.GeneroNaoSuportadoError = GeneroNaoSuportadoError;
