"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricaProjeto = void 0;
const node_crypto_1 = require("node:crypto");
class FabricaProjeto {
    prototipo;
    constructor(prototipo) {
        this.prototipo = prototipo.clonar();
    }
    get genero() {
        return this.prototipo.getGenero();
    }
    criarProjeto(dados = {}) {
        return this.prototipo.clonar().ajustar({ id: (0, node_crypto_1.randomUUID)(), ...dados });
    }
}
exports.FabricaProjeto = FabricaProjeto;
