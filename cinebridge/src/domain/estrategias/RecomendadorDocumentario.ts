import { RecomendadorBase } from "./RecomendadorBase";

export class RecomendadorDocumentario extends RecomendadorBase {
  protected habilidadesChave(): string[] {
    return ["pesquisa", "entrevista", "roteiro documental", "edicao"];
  }
}
