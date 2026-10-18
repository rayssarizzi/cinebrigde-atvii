"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorPublicitario = void 0;
const NotificadorBase_1 = require("./NotificadorBase");
class NotificadorPublicitario extends NotificadorBase_1.NotificadorBase {
    formatar(e) {
        return `[PUB] Campanha ${e.projetoId} | ${this.detalhe(e)}`;
    }
}
exports.NotificadorPublicitario = NotificadorPublicitario;
