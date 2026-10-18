import type { Projeto } from "../projetos/Projeto";
import { ProjetoDocumentario } from "../projetos/ProjetoDocumentario";
import { RecomendadorDocumentario } from "../estrategias/RecomendadorDocumentario";
import { NotificadorDocumentario } from "../notificacoes/NotificadorDocumentario";
import { ValidadorDocumentario } from "../visitantes/ValidadorDocumentario";
import { FabricaProjeto } from "./FabricaProjeto";

export class FabricaDocumentario extends FabricaProjeto {
  constructor(prototipo: Projeto = new ProjetoDocumentario()) {
    super(prototipo);
  }
  criarValidador() { return new ValidadorDocumentario(); }
  criarRecomendador() { return new RecomendadorDocumentario(); }
  criarNotificador() { return new NotificadorDocumentario(); }
}
