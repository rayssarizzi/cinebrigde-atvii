"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipe = void 0;
class Equipe {
    projetoId;
    recomendacoes;
    constructor(projetoId, recomendacoes) {
        this.projetoId = projetoId;
        this.recomendacoes = recomendacoes;
    }
    titulares() {
        const m = new Map();
        for (const [papel, lista] of this.recomendacoes)
            if (lista.length)
                m.set(papel, lista[0]);
        return m;
    }
    custoTitulares() {
        return [...this.titulares().values()].reduce((s, p) => s + p.custo, 0);
    }
}
exports.Equipe = Equipe;
