"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorBase = void 0;
class NotificadorBase {
    mensagens = [];
    atualizar(evento) {
        this.mensagens.push(this.formatar(evento));
    }
    detalhe(e) {
        const quem = e.profissional ? ` ${e.profissional.nome}` : "";
        const papel = e.papel ? ` [${e.papel}]` : "";
        return `${e.tipo}${papel}${quem}`;
    }
}
exports.NotificadorBase = NotificadorBase;
