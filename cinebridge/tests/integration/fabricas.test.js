"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fabricas_1 = require("../../src/config/fabricas");
const contratos_1 = require("../../src/domain/contratos");
const RecomendadorDocumentario_1 = require("../../src/domain/estrategias/RecomendadorDocumentario");
const FabricaAnimacao_1 = require("../../src/domain/fabricas/FabricaAnimacao");
const FabricaDocumentario_1 = require("../../src/domain/fabricas/FabricaDocumentario");
const FabricaPublicitario_1 = require("../../src/domain/fabricas/FabricaPublicitario");
const NotificadorBase_1 = require("../../src/domain/notificacoes/NotificadorBase");
const NotificadorDocumentario_1 = require("../../src/domain/notificacoes/NotificadorDocumentario");
const OrquestradorPadrao_1 = require("../../src/domain/orquestracao/OrquestradorPadrao");
const ValidadorDocumentario_1 = require("../../src/domain/visitantes/ValidadorDocumentario");
const ProjetoAnimacao_1 = require("../../src/domain/projetos/ProjetoAnimacao");
const ProjetoDocumentario_1 = require("../../src/domain/projetos/ProjetoDocumentario");
const ProjetoPublicitario_1 = require("../../src/domain/projetos/ProjetoPublicitario");
const SistemaRecomendacao_1 = require("../../src/servicos/SistemaRecomendacao");
const helpers_1 = require("./helpers");
const amanha = () => new Date(Date.now() + 86_400_000);
const novoSistema = () => new SistemaRecomendacao_1.SistemaRecomendacao((0, fabricas_1.fabricasPadrao)());
(0, vitest_1.describe)("Prototype", () => {
    (0, vitest_1.it)("clonar() devolve cópia profunda e independente", () => {
        const original = new ProjetoDocumentario_1.ProjetoDocumentario({ id: "orig", orcamento: 5000, restricoes: { habilidades: ["pesquisa"] } }, "Amazônia", ["A", "B"]);
        const copia = original.clonar();
        (0, vitest_1.expect)(copia).not.toBe(original);
        (0, vitest_1.expect)(copia).toBeInstanceOf(ProjetoDocumentario_1.ProjetoDocumentario);
        (0, vitest_1.expect)(copia.getTema()).toBe("Amazônia");
        copia.ajustar({ entrevistados: ["Z"], tema: "Cerrado" });
        copia.aceitarRecomendacao(contratos_1.Papel.PESQUISADOR, (0, helpers_1.banco)()[0]);
        (0, vitest_1.expect)(original.getEntrevistados()).toEqual(["A", "B"]);
        (0, vitest_1.expect)(original.getTema()).toBe("Amazônia");
        (0, vitest_1.expect)(original.getRestricoes()).toEqual({ habilidades: ["pesquisa"] });
        (0, vitest_1.expect)(original.getEquipe().size).toBe(0);
        (0, vitest_1.expect)(copia.getEquipe().size).toBe(1);
    });
    (0, vitest_1.it)("clone não herda observadores e copia a equipe em profundidade", () => {
        const a = new ProjetoAnimacao_1.ProjetoAnimacao({ id: "a1", orcamento: 1, duracao: 2 }, "3D", ["blender"]);
        const p = (0, helpers_1.banco)()[4];
        a.aceitarRecomendacao(contratos_1.Papel.ANIMADOR_3D, p);
        a.adicionarObservador({ atualizar() { } });
        const c = a.clonar();
        (0, vitest_1.expect)(c.getObservadores()).toHaveLength(0);
        (0, vitest_1.expect)(c.getEquipe().get(contratos_1.Papel.ANIMADOR_3D)).not.toBe(p);
        (0, vitest_1.expect)(c.getEquipe().get(contratos_1.Papel.ANIMADOR_3D)).toEqual(p);
    });
    (0, vitest_1.it)("cada projeto criado pela fábrica é uma instância nova do modelo", () => {
        const f = new FabricaDocumentario_1.FabricaDocumentario(new ProjetoDocumentario_1.ProjetoDocumentario({ orcamento: 100 }, "Modelo", ["Alguém"]));
        const p1 = f.criarProjeto({ id: "x" });
        const p2 = f.criarProjeto({ id: "y", tema: "Outro" });
        (0, vitest_1.expect)(p1).not.toBe(p2);
        (0, vitest_1.expect)(p1.getTema()).toBe("Modelo");
        (0, vitest_1.expect)(p2.getTema()).toBe("Outro");
        (0, vitest_1.expect)(p1.getOrcamento()).toBe(100);
    });
});
(0, vitest_1.describe)("Prototype: instâncias criadas pela fábrica", () => {
    (0, vitest_1.it)("cada projeto recebe id próprio e lista de papéis independente do modelo", () => {
        const f = new FabricaAnimacao_1.FabricaAnimacao();
        const p1 = f.criarProjeto();
        const p2 = f.criarProjeto();
        (0, vitest_1.expect)(p1.getId()).not.toBe(p2.getId());
        const copia = p1.clonar();
        copia.ajustar({ papeisNecessarios: [contratos_1.Papel.DIRETOR] });
        (0, vitest_1.expect)(copia.getPapeisNecessarios()).toEqual([contratos_1.Papel.DIRETOR]);
        (0, vitest_1.expect)(p1.getPapeisNecessarios()).toHaveLength(5);
        (0, vitest_1.expect)(p2.getPapeisNecessarios()).toHaveLength(5);
    });
});
(0, vitest_1.describe)("Abstract Factory / Factory Method", () => {
    (0, vitest_1.it)("cada fábrica produz uma família coerente", () => {
        const doc = new FabricaDocumentario_1.FabricaDocumentario();
        (0, vitest_1.expect)(doc.criarProjeto()).toBeInstanceOf(ProjetoDocumentario_1.ProjetoDocumentario);
        (0, vitest_1.expect)(doc.criarValidador()).toBeInstanceOf(ValidadorDocumentario_1.ValidadorDocumentario);
        (0, vitest_1.expect)(doc.criarRecomendador()).toBeInstanceOf(RecomendadorDocumentario_1.RecomendadorDocumentario);
        (0, vitest_1.expect)(doc.criarNotificador()).toBeInstanceOf(NotificadorDocumentario_1.NotificadorDocumentario);
        (0, vitest_1.expect)(new FabricaAnimacao_1.FabricaAnimacao().criarProjeto()).toBeInstanceOf(ProjetoAnimacao_1.ProjetoAnimacao);
        (0, vitest_1.expect)(new FabricaPublicitario_1.FabricaPublicitario().criarProjeto()).toBeInstanceOf(ProjetoPublicitario_1.ProjetoPublicitario);
    });
    (0, vitest_1.it)("validador de uma família rejeita projeto de outra", () => {
        const anim = new FabricaAnimacao_1.FabricaAnimacao().criarProjeto({ orcamento: 10, duracao: 3, softwares: ["blender"] });
        (0, vitest_1.expect)(new FabricaDocumentario_1.FabricaDocumentario().criarValidador().visitarProjeto(anim)).toBe(false);
    });
});
(0, vitest_1.describe)("Integração ponta a ponta", () => {
    (0, vitest_1.it)("documentário: recomenda, valida e notifica no formato do gênero", () => {
        const r = novoSistema().recomendar({
            genero: "documentario",
            dados: { id: "d1", orcamento: 20000, tema: "Rios", entrevistados: ["Dona Maria"] },
            profissionais: (0, helpers_1.banco)(),
        });
        const t = r.equipe.titulares();
        (0, vitest_1.expect)(t.get(contratos_1.Papel.PESQUISADOR)?.nome).toBe("Ana Pesquisa");
        (0, vitest_1.expect)(t.get(contratos_1.Papel.EDITOR)?.nome).toBe("Carla Editora");
        (0, vitest_1.expect)(r.notificacoes).toHaveLength(1);
        (0, vitest_1.expect)(r.notificacoes.every((m) => m.startsWith("[DOC]"))).toBe(true);
    });
    (0, vitest_1.it)("animação: prioriza 3D/rigging e descarta profissional com nota baixa", () => {
        const r = novoSistema().recomendar({
            genero: "animacao",
            dados: { id: "a1", orcamento: 50000, duracao: 10, softwares: ["blender"] },
            profissionais: (0, helpers_1.banco)(),
        });
        const animadores = r.equipe.recomendacoes.get(contratos_1.Papel.ANIMADOR_3D);
        (0, vitest_1.expect)(animadores[0].nome).toBe("Eva 3D");
        (0, vitest_1.expect)(animadores.some((p) => p.nome === "Kleber Fraco3D")).toBe(false);
        (0, vitest_1.expect)(r.equipe.titulares().get(contratos_1.Papel.RIGGER)?.nome).toBe("Fabio Rig");
        (0, vitest_1.expect)(r.notificacoes[0].startsWith("[ANIM]")).toBe(true);
    });
    (0, vitest_1.it)("publicitário: ignora indisponíveis e usa formato próprio", () => {
        const r = novoSistema().recomendar({
            genero: "publicitario",
            dados: { id: "p1", orcamento: 9000, duracao: 1, prazo: amanha(), marca: "Acme", canais: ["tv"] },
            profissionais: (0, helpers_1.banco)(),
        });
        (0, vitest_1.expect)(r.equipe.titulares().get(contratos_1.Papel.REDATOR)?.nome).toBe("Hugo Redator");
        (0, vitest_1.expect)(r.notificacoes[0].startsWith("[PUB]")).toBe(true);
    });
    (0, vitest_1.it)("projeto inválido para o gênero é rejeitado", () => {
        (0, vitest_1.expect)(() => novoSistema().recomendar({ genero: "documentario", dados: { orcamento: 0 }, profissionais: (0, helpers_1.banco)() })).toThrow(/restrições/);
    });
    (0, vitest_1.it)("gênero desconhecido gera GeneroNaoSuportadoError", () => {
        const executar = () => novoSistema().recomendar({ genero: "vr", dados: {}, profissionais: [] });
        (0, vitest_1.expect)(executar).toThrow(SistemaRecomendacao_1.GeneroNaoSuportadoError);
        (0, vitest_1.expect)(executar).toThrow(/Gênero não suportado/);
    });
});
(0, vitest_1.describe)("Troca de fábrica sem alterar o orquestrador", () => {
    (0, vitest_1.it)("mesmo OrquestradorPadrao, fábricas diferentes, resultados coerentes", () => {
        const cenarios = [
            [new FabricaDocumentario_1.FabricaDocumentario(), { orcamento: 1, tema: "T", entrevistados: ["x"] }, "[DOC]"],
            [new FabricaAnimacao_1.FabricaAnimacao(), { orcamento: 1, duracao: 1, softwares: ["blender"] }, "[ANIM]"],
            [new FabricaPublicitario_1.FabricaPublicitario(), { orcamento: 1, duracao: 1, prazo: amanha(), marca: "M" }, "[PUB]"],
        ];
        for (const [fabrica, dados, prefixo] of cenarios) {
            const projeto = fabrica.criarProjeto(dados);
            const equipe = new OrquestradorPadrao_1.OrquestradorPadrao(fabrica, (0, helpers_1.banco)()).orquestrar(projeto);
            (0, vitest_1.expect)(equipe.recomendacoes.size).toBeGreaterThan(0);
            const msgs = projeto.getObservadores()
                .flatMap((o) => (o instanceof NotificadorBase_1.NotificadorBase ? o.mensagens : []));
            (0, vitest_1.expect)(msgs.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(msgs.every((m) => m.startsWith(prefixo))).toBe(true);
        }
    });
    (0, vitest_1.it)("novo tipo (VR) exige apenas uma nova fábrica", () => {
        class ProjetoVR extends ProjetoDocumentario_1.ProjetoDocumentario {
            getGenero() { return "vr"; }
            clonar() {
                const c = new ProjetoVR({}, this.getTema(), this.getEntrevistados());
                this.copiarEstadoPara(c);
                return c;
            }
        }
        class FabricaVR extends FabricaDocumentario_1.FabricaDocumentario {
            constructor() { super(new ProjetoVR()); }
        }
        const s = novoSistema();
        s.registrarFabrica(new FabricaVR());
        (0, vitest_1.expect)(s.generosSuportados()).toContain("vr");
        const r = s.recomendar({
            genero: "vr", dados: { orcamento: 5, tema: "Imersão", entrevistados: ["a"] }, profissionais: (0, helpers_1.banco)(),
        });
        (0, vitest_1.expect)(r.equipe.recomendacoes.size).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)("Padrões da ATVI preservados", () => {
    (0, vitest_1.it)("Observer: aceitar, substituir e reavaliar disparam eventos", () => {
        const f = new FabricaDocumentario_1.FabricaDocumentario();
        const p = f.criarProjeto({ orcamento: 1, tema: "T", entrevistados: ["x"] });
        const n = f.criarNotificador();
        p.adicionarObservador(n);
        const [ana, , carla] = (0, helpers_1.banco)();
        p.aceitarRecomendacao(contratos_1.Papel.PESQUISADOR, ana);
        p.substituirMembro(contratos_1.Papel.PESQUISADOR, carla);
        p.solicitarReavaliacao();
        (0, vitest_1.expect)(n.mensagens).toHaveLength(3);
        (0, vitest_1.expect)(n.mensagens[1]).toMatch(/MEMBRO_SUBSTITUIDO/);
        (0, vitest_1.expect)(() => p.aceitarRecomendacao(contratos_1.Papel.RIGGER, ana)).toThrow(/não faz parte/);
    });
    (0, vitest_1.it)("Strategy: orquestrar aceita estratégia externa", () => {
        const f = new FabricaDocumentario_1.FabricaDocumentario();
        const p = f.criarProjeto({ orcamento: 1, tema: "T", entrevistados: ["x"] });
        const eq = new OrquestradorPadrao_1.OrquestradorPadrao(f, (0, helpers_1.banco)())
            .orquestrar(p, { recomendar: () => new Map([[contratos_1.Papel.EDITOR, [(0, helpers_1.banco)()[2]]]]) });
        (0, vitest_1.expect)([...eq.recomendacoes.keys()]).toEqual([contratos_1.Papel.EDITOR]);
    });
});
