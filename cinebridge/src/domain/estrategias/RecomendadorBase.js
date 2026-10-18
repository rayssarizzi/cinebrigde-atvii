"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecomendadorBase = void 0;
class RecomendadorBase {
    maximoPorPapel = 3;
    recomendar(projeto, profissionais) {
        const chaves = this.habilidadesChave(projeto).map((h) => h.toLowerCase());
        const resultado = new Map();
        for (const papel of projeto.getPapeisNecessarios()) {
            const ranking = profissionais
                .filter((p) => p.papeis.includes(papel))
                .map((p) => ({ p, score: this.pontuar(p, chaves) }))
                .sort((a, b) => b.score - a.score || a.p.custo - b.p.custo)
                .slice(0, this.maximoPorPapel)
                .map((x) => x.p);
            resultado.set(papel, ranking);
        }
        return resultado;
    }
    pontuar(p, chaves) {
        const hab = p.habilidades.map((h) => h.toLowerCase());
        const casadas = chaves.filter((c) => hab.includes(c)).length;
        const cobertura = chaves.length ? casadas / chaves.length : 0;
        return cobertura * 10 * 0.7 + p.nota * 0.3;
    }
}
exports.RecomendadorBase = RecomendadorBase;
