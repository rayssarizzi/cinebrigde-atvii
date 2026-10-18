"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadorBase = void 0;
class ValidadorBase {
    visitarProfissional(p) {
        return p.disponivel && p.custo > 0 && p.nota >= 0 && p.nota <= 10;
    }
}
exports.ValidadorBase = ValidadorBase;
