import type { Projeto } from "../projetos/Projeto";
import { ProjetoPublicitario } from "../projetos/ProjetoPublicitario";
import { RecomendadorPublicitario } from "../estrategias/RecomendadorPublicitario";
import { NotificadorPublicitario } from "../notificacoes/NotificadorPublicitario";
import { ValidadorPublicitario } from "../visitantes/ValidadorPublicitario";
import { FabricaProjeto } from "./FabricaProjeto";

export class FabricaPublicitario extends FabricaProjeto {
  constructor(prototipo: Projeto = new ProjetoPublicitario()) {
    super(prototipo);
  }
  criarValidador() { return new ValidadorPublicitario(); }
  criarRecomendador() { return new RecomendadorPublicitario(); }
  criarNotificador() { return new NotificadorPublicitario(); }
}
