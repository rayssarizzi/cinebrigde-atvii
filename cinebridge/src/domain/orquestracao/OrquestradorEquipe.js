"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrquestradorEquipe = void 0;
const Equipe_1 = require("./Equipe");
class OrquestradorEquipe {
    fabrica;
    candidatos;
    constructor(fabrica, candidatos = []) {
        this.fabrica = fabrica;
        this.candidatos = candidatos;
    }
    orquestrar(projeto, estrategia) {
        if (!this.validarRestricoes(projeto)) {
            throw new Error(`Projeto ${projeto.getId()} (${projeto.getGenero()}) violou as restrições`);
        }
        const notificador = this.fabrica.criarNotificador();
        projeto.adicionarObservador(notificador);
        const profissionais = this.normalizarDados(projeto, this.candidatos);
        const usada = estrategia ?? this.fabrica.criarRecomendador();
        const recomendacoes = this.posProcessar(usada.recomendar(projeto, profissionais));
        projeto.notificar("RECOMENDACAO_GERADA");
        return new Equipe_1.Equipe(projeto.getId(), recomendacoes);
    }
}
exports.OrquestradorEquipe = OrquestradorEquipe;
