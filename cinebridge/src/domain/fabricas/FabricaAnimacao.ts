import type { Projeto } from "../projetos/Projeto";
import { ProjetoAnimacao } from "../projetos/ProjetoAnimacao";
import { RecomendadorAnimacao } from "../estrategias/RecomendadorAnimacao";
import { NotificadorAnimacao } from "../notificacoes/NotificadorAnimacao";
import { ValidadorAnimacao } from "../visitantes/ValidadorAnimacao";
import { FabricaProjeto } from "./FabricaProjeto";

export class FabricaAnimacao extends FabricaProjeto {
  constructor(prototipo: Projeto = new ProjetoAnimacao()) {
    super(prototipo);
  }
  criarValidador() { return new ValidadorAnimacao(); }
  criarRecomendador() { return new RecomendadorAnimacao(); }
  criarNotificador() { return new NotificadorAnimacao(); }
}
