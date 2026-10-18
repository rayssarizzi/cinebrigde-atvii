"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorDocumentario = void 0;
const NotificadorBase_1 = require("./NotificadorBase");
class NotificadorDocumentario extends NotificadorBase_1.NotificadorBase {
    formatar(e) {
        return `[DOC] Projeto ${e.projetoId}: ${this.detalhe(e)}`;
    }
}
exports.NotificadorDocumentario = NotificadorDocumentario;
