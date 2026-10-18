import { FabricaAnimacao } from "../domain/fabricas/FabricaAnimacao";
import { FabricaDocumentario } from "../domain/fabricas/FabricaDocumentario";
import { FabricaProjeto } from "../domain/fabricas/FabricaProjeto";
import { FabricaPublicitario } from "../domain/fabricas/FabricaPublicitario";
import { SistemaRecomendacao } from "../servicos/SistemaRecomendacao";

export function fabricasPadrao(): FabricaProjeto[] {
  return [new FabricaDocumentario(), new FabricaAnimacao(), new FabricaPublicitario()];
}

export function criarSistemaRecomendacao(): SistemaRecomendacao {
  return new SistemaRecomendacao(fabricasPadrao());
}
