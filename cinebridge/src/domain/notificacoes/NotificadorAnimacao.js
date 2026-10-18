"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorAnimacao = void 0;
const NotificadorBase_1 = require("./NotificadorBase");
class NotificadorAnimacao extends NotificadorBase_1.NotificadorBase {
    formatar(e) {
        return `[ANIM] Pipeline ${e.projetoId} -> ${this.detalhe(e)}`;
    }
}
exports.NotificadorAnimacao = NotificadorAnimacao;
