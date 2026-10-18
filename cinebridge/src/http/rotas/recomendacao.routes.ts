import type { FastifyInstance } from 'fastify';
import { Projeto } from '../../entities/Projeto';
import { PapelRequisito } from '../../entities/PapelRequisito';
import { ServicoRecomendacao } from '../../servicos/ServicoRecomendacao';
import { ServicoConvites } from '../../servicos/ServicoConvites';
import { ComposicaoVisitavel } from '../../domain/visitantes/ComposicaoVisitavel';
import { ValidadorConsistenciaVisitante } from '../../domain/visitantes/ValidadorConsistenciaVisitante';
import { PontuacaoCompatibilidadeVisitante } from '../../domain/visitantes/PontuacaoCompatibilidadeVisitante';
import { GeradorRelatorioVisitante } from '../../domain/visitantes/GeradorRelatorioVisitante';
import { RestricaoOrcamentariaError } from '../../domain/orquestracao/erros';
import type { CriarProjetoDTO } from '../../domain/dtos';

function montarProjetoAPartirDoCorpo(corpo: CriarProjetoDTO): { projeto: Projeto; papeis: PapelRequisito[] } {
  const projeto = new Projeto();
  projeto.id = crypto.randomUUID();
  projeto.genero = corpo.genero;
  projeto.duracaoEstimadaMinutos = corpo.duracaoEstimadaMinutos;
  projeto.orcamentoTotal = corpo.orcamentoTotal;
  projeto.dataEntrega = corpo.dataEntrega;
  projeto.tipoCaptacao = corpo.tipoCaptacao;
  projeto.localizacao = corpo.localizacao;
  projeto.estrategiaPreferida = corpo.estrategiaPreferida ?? 'auto';

  const papeis = corpo.papeis.map((p) => {
    const papel = new PapelRequisito();
    papel.papel = p.papel;
    papel.peso = p.peso;
    papel.requisitosCompetencia = p.requisitosCompetencia ?? {};
    return papel;
  });

  return { projeto, papeis };
}

export function registrarRotasRecomendacao(
  app: FastifyInstance,
  servicoRecomendacao: ServicoRecomendacao,
  _servicoConvites: ServicoConvites,
) {
  app.post<{ Body: CriarProjetoDTO }>('/projetos/recomendacoes', async (requisicao, resposta) => {
    const corpo = requisicao.body;

    if (!corpo?.papeis?.length) {
      return resposta.status(400).send({ erro: 'o projeto precisa de ao menos um papel requerido' });
    }

    const { projeto, papeis } = montarProjetoAPartirDoCorpo(corpo);

    try {
      const composicao = await servicoRecomendacao.gerarRecomendacoes(projeto, papeis);

      const visitavel = new ComposicaoVisitavel(composicao);
      const validacao = visitavel.aceitar(new ValidadorConsistenciaVisitante());
      const compatibilidade = visitavel.aceitar(new PontuacaoCompatibilidadeVisitante());
      const relatorio = visitavel.aceitar(new GeradorRelatorioVisitante());

      return resposta.status(composicao.parcial ? 206 : 200).send({
        composicao,
        validacao,
        pontuacaoCompatibilidade: compatibilidade,
        relatorio,
      });
    } catch (erro) {
      if (erro instanceof RestricaoOrcamentariaError) {
        return resposta.status(422).send({ erro: erro.message });
      }
      throw erro;
    }
  });
}
