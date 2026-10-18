import { describe, expect, it } from "vitest";
import { fabricasPadrao } from "../../src/config/fabricas";
import { Papel } from "../../src/domain/contratos";
import { RecomendadorDocumentario } from "../../src/domain/estrategias/RecomendadorDocumentario";
import { FabricaAnimacao } from "../../src/domain/fabricas/FabricaAnimacao";
import { FabricaDocumentario } from "../../src/domain/fabricas/FabricaDocumentario";
import type { FabricaProjeto } from "../../src/domain/fabricas/FabricaProjeto";
import { FabricaPublicitario } from "../../src/domain/fabricas/FabricaPublicitario";
import { NotificadorBase } from "../../src/domain/notificacoes/NotificadorBase";
import { NotificadorDocumentario } from "../../src/domain/notificacoes/NotificadorDocumentario";
import { OrquestradorPadrao } from "../../src/domain/orquestracao/OrquestradorPadrao";
import { ValidadorDocumentario } from "../../src/domain/visitantes/ValidadorDocumentario";
import type { Projeto } from "../../src/domain/projetos/Projeto";
import { ProjetoAnimacao } from "../../src/domain/projetos/ProjetoAnimacao";
import { ProjetoDocumentario } from "../../src/domain/projetos/ProjetoDocumentario";
import { ProjetoPublicitario } from "../../src/domain/projetos/ProjetoPublicitario";
import { GeneroNaoSuportadoError, SistemaRecomendacao } from "../../src/servicos/SistemaRecomendacao";
import { banco } from "./helpers";

const amanha = () => new Date(Date.now() + 86_400_000);
const novoSistema = () => new SistemaRecomendacao(fabricasPadrao());

describe("Prototype", () => {
  it("clonar() devolve cópia profunda e independente", () => {
    const original = new ProjetoDocumentario(
      { id: "orig", orcamento: 5000, restricoes: { habilidades: ["pesquisa"] } }, "Amazônia", ["A", "B"],
    );
    const copia = original.clonar();

    expect(copia).not.toBe(original);
    expect(copia).toBeInstanceOf(ProjetoDocumentario);
    expect(copia.getTema()).toBe("Amazônia");

    copia.ajustar({ entrevistados: ["Z"], tema: "Cerrado" });
    copia.aceitarRecomendacao(Papel.PESQUISADOR, banco()[0]);

    expect(original.getEntrevistados()).toEqual(["A", "B"]);
    expect(original.getTema()).toBe("Amazônia");
    expect(original.getRestricoes()).toEqual({ habilidades: ["pesquisa"] });
    expect(original.getEquipe().size).toBe(0);
    expect(copia.getEquipe().size).toBe(1);
  });

  it("clone não herda observadores e copia a equipe em profundidade", () => {
    const a = new ProjetoAnimacao({ id: "a1", orcamento: 1, duracao: 2 }, "3D", ["blender"]);
    const p = banco()[4];
    a.aceitarRecomendacao(Papel.ANIMADOR_3D, p);
    a.adicionarObservador({ atualizar() {} });
    const c = a.clonar();
    expect(c.getObservadores()).toHaveLength(0);
    expect(c.getEquipe().get(Papel.ANIMADOR_3D)).not.toBe(p);
    expect(c.getEquipe().get(Papel.ANIMADOR_3D)).toEqual(p);
  });

  it("cada projeto criado pela fábrica é uma instância nova do modelo", () => {
    const f = new FabricaDocumentario(new ProjetoDocumentario({ orcamento: 100 }, "Modelo", ["Alguém"]));
    const p1 = f.criarProjeto({ id: "x" }) as ProjetoDocumentario;
    const p2 = f.criarProjeto({ id: "y", tema: "Outro" }) as ProjetoDocumentario;
    expect(p1).not.toBe(p2);
    expect(p1.getTema()).toBe("Modelo");
    expect(p2.getTema()).toBe("Outro");
    expect(p1.getOrcamento()).toBe(100);
  });
});

describe("Prototype: instâncias criadas pela fábrica", () => {
  it("cada projeto recebe id próprio e lista de papéis independente do modelo", () => {
    const f = new FabricaAnimacao();
    const p1 = f.criarProjeto();
    const p2 = f.criarProjeto();
    expect(p1.getId()).not.toBe(p2.getId());

    const copia = p1.clonar();
    copia.ajustar({ papeisNecessarios: [Papel.DIRETOR] });
    expect(copia.getPapeisNecessarios()).toEqual([Papel.DIRETOR]);
    expect(p1.getPapeisNecessarios()).toHaveLength(5);
    expect(p2.getPapeisNecessarios()).toHaveLength(5);
  });
});

describe("Abstract Factory / Factory Method", () => {
  it("cada fábrica produz uma família coerente", () => {
    const doc = new FabricaDocumentario();
    expect(doc.criarProjeto()).toBeInstanceOf(ProjetoDocumentario);
    expect(doc.criarValidador()).toBeInstanceOf(ValidadorDocumentario);
    expect(doc.criarRecomendador()).toBeInstanceOf(RecomendadorDocumentario);
    expect(doc.criarNotificador()).toBeInstanceOf(NotificadorDocumentario);
    expect(new FabricaAnimacao().criarProjeto()).toBeInstanceOf(ProjetoAnimacao);
    expect(new FabricaPublicitario().criarProjeto()).toBeInstanceOf(ProjetoPublicitario);
  });

  it("validador de uma família rejeita projeto de outra", () => {
    const anim = new FabricaAnimacao().criarProjeto({ orcamento: 10, duracao: 3, softwares: ["blender"] });
    expect(new FabricaDocumentario().criarValidador().visitarProjeto(anim)).toBe(false);
  });
});

describe("Integração ponta a ponta", () => {
  it("documentário: recomenda, valida e notifica no formato do gênero", () => {
    const r = novoSistema().recomendar({
      genero: "documentario",
      dados: { id: "d1", orcamento: 20000, tema: "Rios", entrevistados: ["Dona Maria"] },
      profissionais: banco(),
    });
    const t = r.equipe.titulares();
    expect(t.get(Papel.PESQUISADOR)?.nome).toBe("Ana Pesquisa");
    expect(t.get(Papel.EDITOR)?.nome).toBe("Carla Editora");
    expect(r.notificacoes).toHaveLength(1);
    expect(r.notificacoes.every((m) => m.startsWith("[DOC]"))).toBe(true);
  });

  it("animação: prioriza 3D/rigging e descarta profissional com nota baixa", () => {
    const r = novoSistema().recomendar({
      genero: "animacao",
      dados: { id: "a1", orcamento: 50000, duracao: 10, softwares: ["blender"] },
      profissionais: banco(),
    });
    const animadores = r.equipe.recomendacoes.get(Papel.ANIMADOR_3D)!;
    expect(animadores[0].nome).toBe("Eva 3D");
    expect(animadores.some((p) => p.nome === "Kleber Fraco3D")).toBe(false);
    expect(r.equipe.titulares().get(Papel.RIGGER)?.nome).toBe("Fabio Rig");
    expect(r.notificacoes[0].startsWith("[ANIM]")).toBe(true);
  });

  it("publicitário: ignora indisponíveis e usa formato próprio", () => {
    const r = novoSistema().recomendar({
      genero: "publicitario",
      dados: { id: "p1", orcamento: 9000, duracao: 1, prazo: amanha(), marca: "Acme", canais: ["tv"] },
      profissionais: banco(),
    });
    expect(r.equipe.titulares().get(Papel.REDATOR)?.nome).toBe("Hugo Redator");
    expect(r.notificacoes[0].startsWith("[PUB]")).toBe(true);
  });

  it("projeto inválido para o gênero é rejeitado", () => {
    expect(() =>
      novoSistema().recomendar({ genero: "documentario", dados: { orcamento: 0 }, profissionais: banco() }),
    ).toThrow(/restrições/);
  });

  it("gênero desconhecido gera GeneroNaoSuportadoError", () => {
    const executar = () => novoSistema().recomendar({ genero: "vr", dados: {}, profissionais: [] });
    expect(executar).toThrow(GeneroNaoSuportadoError);
    expect(executar).toThrow(/Gênero não suportado/);
  });
});

describe("Troca de fábrica sem alterar o orquestrador", () => {
  it("mesmo OrquestradorPadrao, fábricas diferentes, resultados coerentes", () => {
    const cenarios: [FabricaProjeto, Record<string, unknown>, string][] = [
      [new FabricaDocumentario(), { orcamento: 1, tema: "T", entrevistados: ["x"] }, "[DOC]"],
      [new FabricaAnimacao(), { orcamento: 1, duracao: 1, softwares: ["blender"] }, "[ANIM]"],
      [new FabricaPublicitario(), { orcamento: 1, duracao: 1, prazo: amanha(), marca: "M" }, "[PUB]"],
    ];
    for (const [fabrica, dados, prefixo] of cenarios) {
      const projeto: Projeto = fabrica.criarProjeto(dados);
      const equipe = new OrquestradorPadrao(fabrica, banco()).orquestrar(projeto);
      expect(equipe.recomendacoes.size).toBeGreaterThan(0);
      const msgs = projeto.getObservadores()
        .flatMap((o) => (o instanceof NotificadorBase ? o.mensagens : []));
      expect(msgs.length).toBeGreaterThan(0);
      expect(msgs.every((m) => m.startsWith(prefixo))).toBe(true);
    }
  });

  it("novo tipo (VR) exige apenas uma nova fábrica", () => {
    class ProjetoVR extends ProjetoDocumentario {
      override getGenero() { return "vr"; }
      override clonar(): ProjetoVR {
        const c = new ProjetoVR({}, this.getTema(), this.getEntrevistados());
        this.copiarEstadoPara(c);
        return c;
      }
    }
    class FabricaVR extends FabricaDocumentario {
      constructor() { super(new ProjetoVR()); }
    }
    const s = novoSistema();
    s.registrarFabrica(new FabricaVR());
    expect(s.generosSuportados()).toContain("vr");
    const r = s.recomendar({
      genero: "vr", dados: { orcamento: 5, tema: "Imersão", entrevistados: ["a"] }, profissionais: banco(),
    });
    expect(r.equipe.recomendacoes.size).toBeGreaterThan(0);
  });
});

describe("Padrões da ATVI preservados", () => {
  it("Observer: aceitar, substituir e reavaliar disparam eventos", () => {
    const f = new FabricaDocumentario();
    const p = f.criarProjeto({ orcamento: 1, tema: "T", entrevistados: ["x"] });
    const n = f.criarNotificador() as NotificadorDocumentario;
    p.adicionarObservador(n);
    const [ana, , carla] = banco();
    p.aceitarRecomendacao(Papel.PESQUISADOR, ana);
    p.substituirMembro(Papel.PESQUISADOR, carla);
    p.solicitarReavaliacao();
    expect(n.mensagens).toHaveLength(3);
    expect(n.mensagens[1]).toMatch(/MEMBRO_SUBSTITUIDO/);
    expect(() => p.aceitarRecomendacao(Papel.RIGGER, ana)).toThrow(/não faz parte/);
  });

  it("Strategy: orquestrar aceita estratégia externa", () => {
    const f = new FabricaDocumentario();
    const p = f.criarProjeto({ orcamento: 1, tema: "T", entrevistados: ["x"] });
    const eq = new OrquestradorPadrao(f, banco())
      .orquestrar(p, { recomendar: () => new Map([[Papel.EDITOR, [banco()[2]]]]) });
    expect([...eq.recomendacoes.keys()]).toEqual([Papel.EDITOR]);
  });
});
