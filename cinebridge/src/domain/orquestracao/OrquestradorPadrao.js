"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrquestradorPadrao = void 0;
const OrquestradorEquipe_1 = require("./OrquestradorEquipe");
class OrquestradorPadrao extends OrquestradorEquipe_1.OrquestradorEquipe {
    validarRestricoes(projeto) {
        return projeto.aceitarVisitante(this.fabrica.criarValidador());
    }
    normalizarDados(_projeto, profissionais) {
        const validador = this.fabrica.criarValidador();
        const vistos = new Set();
        return profissionais.filter((p) => {
            if (vistos.has(p.id) || !validador.visitarProfissional(p))
                return false;
            vistos.add(p.id);
            return true;
        });
    }
    posProcessar(recomendacoes) {
        const saida = new Map();
        for (const [papel, lista] of recomendacoes)
            if (lista.length)
                saida.set(papel, lista);
        return saida;
    }
}
exports.OrquestradorPadrao = OrquestradorPadrao;
