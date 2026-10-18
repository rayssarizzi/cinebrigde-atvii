"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecomendadorPublicitario = void 0;
const RecomendadorBase_1 = require("./RecomendadorBase");
class RecomendadorPublicitario extends RecomendadorBase_1.RecomendadorBase {
    habilidadesChave() {
        return ["copywriting", "branding", "midia digital"];
    }
}
exports.RecomendadorPublicitario = RecomendadorPublicitario;
