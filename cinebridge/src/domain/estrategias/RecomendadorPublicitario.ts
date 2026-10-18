import { RecomendadorBase } from "./RecomendadorBase";

export class RecomendadorPublicitario extends RecomendadorBase {
  protected habilidadesChave(): string[] {
    return ["copywriting", "branding", "midia digital"];
  }
}
