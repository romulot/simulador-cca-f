import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { carregarPar, parseGabarito, parseSimulado } from "./parser";
import { FormatoInvalido } from "./erros";

describe("parser", () => {
  describe("corpus real (35 pares simulado/gabarito)", () => {
    it("parseia todos os 35 pares sem erro, produzindo 240 questões com 5 campos de metadados", () => {
      const baseDir = join(process.cwd(), "content/simulados");
      const dominios = readdirSync(baseDir).filter((d) =>
        d.startsWith("dominio-"),
      );

      let totalQuestoes = 0;
      const questoesComMetadados: Array<{ origem: string; numero: number }> =
        [];

      for (const dominio of dominios) {
        const dominioPath = join(baseDir, dominio);
        const arquivos = readdirSync(dominioPath);

        const simulados = arquivos
          .filter((a) => a.endsWith("_simulado.md"))
          .sort();

        for (const nomeSimulado of simulados) {
          const nomeGabarito = nomeSimulado.replace(
            "_simulado.md",
            "_gabarito.md",
          );

          const caminhoSimulado = join(dominioPath, nomeSimulado);
          const caminhoGabarito = join(dominioPath, nomeGabarito);

          const questoes = carregarPar(caminhoSimulado, caminhoGabarito);

          for (const q of questoes) {
            totalQuestoes++;
            questoesComMetadados.push({
              origem: q.origem,
              numero: q.numero,
            });

            // Validar 5 campos de metadados obrigatórios
            expect(q.metadados).toBeDefined();
            expect(q.metadados.bloom).toBeTruthy();
            expect(q.metadados.dificuldade).toBeTruthy();
            expect(q.metadados.rubrica).toBeTruthy();
            expect(q.metadados.cenario).toBeTruthy();
            expect(q.metadados.principioTestado).toBeTruthy();

            // Validar estrutura de questão
            expect(q.enunciado).toBeTruthy();
            expect(q.alternativas).toBeDefined();
            expect(q.alternativas.A).toBeTruthy();
            expect(q.alternativas.B).toBeTruthy();
            expect(q.alternativas.C).toBeTruthy();
            expect(q.alternativas.D).toBeTruthy();
            expect(q.correta).toMatch(/^[A-D]$/);
            expect(q.explicacoes).toBeDefined();
            expect(q.explicacoes.A).toBeTruthy();
            expect(q.explicacoes.B).toBeTruthy();
            expect(q.explicacoes.C).toBeTruthy();
            expect(q.explicacoes.D).toBeTruthy();
          }
        }
      }

      expect(totalQuestoes).toBe(240);
      expect(questoesComMetadados.length).toBe(240);
    });
  });

  describe("casos de erro com fixtures inválidas", () => {
    it("lança FormatoInvalido para alternativa duplicada no simulado", () => {
      const simuladoInvalido = `
## Q1

Qual é a resposta?

- **A)** Primeira alternativa
- **B)** Segunda alternativa
- **A)** Duplicada no lugar de C
- **D)** Quarta alternativa
`;

      expect(() => parseSimulado(simuladoInvalido, "teste.md")).toThrow(
        FormatoInvalido,
      );

      try {
        parseSimulado(simuladoInvalido, "teste.md");
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.questao).toBe(1);
        expect(erro.motivo).toContain("duplicada");
      }
    });

    it("lança FormatoInvalido para explicação faltando no gabarito", () => {
      const gabaritoInvalido = `
## Q1 — Resposta correta: **A** · (1.0)

Esta é uma questão de exemplo.

- **A — correta:**
- **B — errada:**
- **C — errada:** Explicação para C
- **D — errada:** Explicação para D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica (§1): 2 = Bloom 1 + distratores 1
- Cenário: S1 — Test
- Princípio testado (§1): testando
`;

      expect(() => parseGabarito(gabaritoInvalido, "teste.md")).toThrow(
        FormatoInvalido,
      );

      try {
        parseGabarito(gabaritoInvalido, "teste.md");
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.questao).toBe(1);
        expect(erro.motivo).toContain("vazias");
      }
    });

    it("lança FormatoInvalido para rótulo 'correta' divergente do header", () => {
      const gabaritoInvalido = `
## Q1 — Resposta correta: **A** · (1.0)

Esta é uma questão de exemplo.

- **A — errada:** Explicação para A
- **B — correta:** Explicação para B, mas header diz A
- **C — errada:** Explicação para C
- **D — errada:** Explicação para D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica (§1): 2 = Bloom 1 + distratores 1
- Cenário: S1 — Test
- Princípio testado (§1): testando
`;

      expect(() => parseGabarito(gabaritoInvalido, "teste.md")).toThrow(
        FormatoInvalido,
      );

      try {
        parseGabarito(gabaritoInvalido, "teste.md");
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.questao).toBe(1);
        expect(erro.motivo).toContain("rótulo 'correta'");
      }
    });
  });

  describe("metadados com sufixo (§N)", () => {
    it("captura campos de metadados mesmo com sufixo (§N) como em dominio-3", () => {
      // Padrão real do arquivo 3.2_commands_e_skills_gabarito.md
      const gabaritoComSufixo = `
## Q1 — Resposta correta: **C** · (3.2)

O requisito é rodar a skill automaticamente.

- **A — errada:** Explicação A
- **B — errada:** Explicação B
- **C — correta:**
- **D — errada:** Explicação D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica (§3): 5 = Bloom 2 + integração 1 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado (§6): isolar execução verbosa em sub-agente

## Q2 — Resposta correta: **A** · (3.2)

Outra questão de exemplo.

- **A — correta:**
- **B — errada:** Explicação B
- **C — errada:** Explicação C
- **D — errada:** Explicação D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica (§3): 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado (§6): \`argument-hint\` é UX de autocomplete, não gate de validação
`;

      const questoes = parseGabarito(gabaritoComSufixo, "teste.md");

      expect(questoes).toHaveLength(2);

      // Q1
      expect(questoes[0].metadados.bloom).toBe("Aplicar");
      expect(questoes[0].metadados.dificuldade).toBe("Médio");
      expect(questoes[0].metadados.rubrica).toBe(
        "5 = Bloom 2 + integração 1 + cenário 1 + distratores 1",
      );
      expect(questoes[0].metadados.cenario).toBe("S4 — Developer Productivity");
      expect(questoes[0].metadados.principioTestado).toContain(
        "sub-agente",
      );

      // Q2
      expect(questoes[1].metadados.bloom).toBe("Aplicar");
      expect(questoes[1].metadados.rubrica).toBe(
        "4 = Bloom 2 + integração 0 + cenário 1 + distratores 1",
      );
      expect(questoes[1].metadados.cenario).toBe(
        "S2 — Code Generation with Claude Code",
      );
      expect(questoes[1].metadados.principioTestado).toContain("autocomplete");
    });

    it("captura campos de metadados com (§N) sem quebras de linha após", () => {
      // Variante compacta
      const gabaritoCompacto = `
## Q1 — Resposta correta: **D** · (3.2)

Requisito sobre least privilege.

- **A — errada:** Instrução em prosa
- **B — errada:** Hook PostToolUse
- **C — errada:** Taxa de acerto passada
- **D — correta:**

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica (§3): 8 = Bloom 3 + integração 2 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado (§6): least privilege / ferramentas escopadas determinística
`;

      const questoes = parseGabarito(gabaritoCompacto, "teste.md");

      expect(questoes).toHaveLength(1);
      expect(questoes[0].metadados.bloom).toBe("Analisar");
      expect(questoes[0].metadados.dificuldade).toBe("Difícil");
      expect(questoes[0].metadados.rubrica).toContain("Bloom 3");
      expect(questoes[0].metadados.cenario).toContain("CI");
      expect(questoes[0].metadados.principioTestado).toContain("least privilege");
    });
  });

  describe("validação de estrutura completa", () => {
    it("rejeita simulado com alternativa faltando", () => {
      const simuladoIncompleto = `
## Q1

Qual é a resposta?

- **A)** Primeira alternativa
- **B)** Segunda alternativa
- **C)** Terceira alternativa
`;

      expect(() => parseSimulado(simuladoIncompleto, "teste.md")).toThrow(
        FormatoInvalido,
      );

      try {
        parseSimulado(simuladoIncompleto, "teste.md");
      } catch (e) {
        const erro = e as FormatoInvalido;
        expect(erro.motivo).toContain("faltam alternativas");
      }
    });

    it("rejeita gabarito sem bloco de metadados", () => {
      const gabaritoSemMetadados = `
## Q1 — Resposta correta: **A** · (1.0)

Esta é uma questão de exemplo.

- **A — correta:**
- **B — errada:** Explicação para B
- **C — errada:** Explicação para C
- **D — errada:** Explicação para D
`;

      expect(() =>
        parseGabarito(gabaritoSemMetadados, "teste.md"),
      ).toThrow(FormatoInvalido);

      try {
        parseGabarito(gabaritoSemMetadados, "teste.md");
      } catch (e) {
        const erro = e as FormatoInvalido;
        expect(erro.motivo).toContain("metadados ausente");
      }
    });

    it("rejeita gabarito com campo de metadado faltando", () => {
      const gabaritoMetadadosIncompletos = `
## Q1 — Resposta correta: **A** · (1.0)

Esta é uma questão de exemplo.

- **A — correta:**
- **B — errada:** Explicação para B
- **C — errada:** Explicação para C
- **D — errada:** Explicação para D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 2 = Bloom 1
`;

      expect(() =>
        parseGabarito(gabaritoMetadadosIncompletos, "teste.md"),
      ).toThrow(FormatoInvalido);

      try {
        parseGabarito(gabaritoMetadadosIncompletos, "teste.md");
      } catch (e) {
        const erro = e as FormatoInvalido;
        expect(erro.motivo).toContain("faltam campos de metadados");
      }
    });
  });

  describe("carregarPar — casos de erro com contagem e numeração", () => {
    const baseDir = join(process.cwd(), "content/simulados");
    const testDir = join(baseDir, "_fixture-carregarpar");

    const templateSimulado = (questoes: string) => `# Simulado — Teste

${questoes}`;

    const templateGabarito = (questoes: string) => `# Gabarito — Teste

${questoes}`;

    const questaoSimuladoValida = (numero: number) => `
## Q${numero}

Pergunta de teste ${numero}?

- **A)** Alternativa A
- **B)** Alternativa B
- **C)** Alternativa C
- **D)** Alternativa D
`;

    const questaoGabaritoValida = (numero: number) => `
## Q${numero} — Resposta correta: **A** · (1.0)

Resposta para a questão ${numero}.

- **A — correta:**
- **B — errada:** Porque não é B
- **C — errada:** Porque não é C
- **D — errada:** Porque não é D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica (§1): 2 = Bloom 1 + distratores 1
- Cenário: S1 — Test
- Princípio testado (§1): teste
`;

    beforeEach(() => {
      // Cria diretório de teste
      mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
      // Limpa diretório de teste
      try {
        rmSync(testDir, { recursive: true, force: true });
      } catch {
        // Ignorar erros de limpeza
      }
    });

    it("lança FormatoInvalido quando simulado tem 2 questões e gabarito tem 1", () => {
      const simulado = templateSimulado(
        questaoSimuladoValida(1) + questaoSimuladoValida(2),
      );
      const gabarito = templateGabarito(questaoGabaritoValida(1));

      const caminhoSimulado = join(testDir, "teste_simulado.md");
      const caminhoGabarito = join(testDir, "teste_gabarito.md");

      writeFileSync(caminhoSimulado, simulado, "utf-8");
      writeFileSync(caminhoGabarito, gabarito, "utf-8");

      expect(() => carregarPar(caminhoSimulado, caminhoGabarito)).toThrow(
        FormatoInvalido,
      );

      try {
        carregarPar(caminhoSimulado, caminhoGabarito);
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.motivo).toContain("2 questões no simulado");
        expect(erro.motivo).toContain("1 respostas no gabarito");
      }
    });

    it("lança FormatoInvalido quando gabarito tem 2 questões e simulado tem 1", () => {
      const simulado = templateSimulado(questaoSimuladoValida(1));
      const gabarito = templateGabarito(
        questaoGabaritoValida(1) + questaoGabaritoValida(2),
      );

      const caminhoSimulado = join(testDir, "teste2_simulado.md");
      const caminhoGabarito = join(testDir, "teste2_gabarito.md");

      writeFileSync(caminhoSimulado, simulado, "utf-8");
      writeFileSync(caminhoGabarito, gabarito, "utf-8");

      expect(() => carregarPar(caminhoSimulado, caminhoGabarito)).toThrow(
        FormatoInvalido,
      );

      try {
        carregarPar(caminhoSimulado, caminhoGabarito);
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.motivo).toContain("1 questões no simulado");
        expect(erro.motivo).toContain("2 respostas no gabarito");
      }
    });

    it("lança FormatoInvalido quando numeração diverge (Q1/Q2 vs Q1/Q3)", () => {
      const simulado = templateSimulado(
        questaoSimuladoValida(1) + questaoSimuladoValida(2),
      );
      // Gabarito com Q1 e Q3 em vez de Q1 e Q2
      const questaoGabaritoCustom = (numero: number) => `
## Q${numero} — Resposta correta: **A** · (1.0)

Resposta para a questão ${numero}.

- **A — correta:**
- **B — errada:** Porque não é B
- **C — errada:** Porque não é C
- **D — errada:** Porque não é D

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica (§1): 2 = Bloom 1 + distratores 1
- Cenário: S1 — Test
- Princípio testado (§1): teste
`;
      const gabarito = templateGabarito(
        questaoGabaritoCustom(1) + questaoGabaritoCustom(3),
      );

      const caminhoSimulado = join(testDir, "teste3_simulado.md");
      const caminhoGabarito = join(testDir, "teste3_gabarito.md");

      writeFileSync(caminhoSimulado, simulado, "utf-8");
      writeFileSync(caminhoGabarito, gabarito, "utf-8");

      expect(() => carregarPar(caminhoSimulado, caminhoGabarito)).toThrow(
        FormatoInvalido,
      );

      try {
        carregarPar(caminhoSimulado, caminhoGabarito);
      } catch (e) {
        expect(e).toBeInstanceOf(FormatoInvalido);
        const erro = e as FormatoInvalido;
        expect(erro.questao).toBe(2);
        expect(erro.motivo).toContain("gabarito traz Q3");
      }
    });

    it("carrega com sucesso um par válido de simulado/gabarito no disco", () => {
      const simulado = templateSimulado(
        questaoSimuladoValida(1) + questaoSimuladoValida(2),
      );
      const gabarito = templateGabarito(
        questaoGabaritoValida(1) + questaoGabaritoValida(2),
      );

      const caminhoSimulado = join(testDir, "teste4_simulado.md");
      const caminhoGabarito = join(testDir, "teste4_gabarito.md");

      writeFileSync(caminhoSimulado, simulado, "utf-8");
      writeFileSync(caminhoGabarito, gabarito, "utf-8");

      const questoes = carregarPar(caminhoSimulado, caminhoGabarito);

      expect(questoes).toHaveLength(2);
      expect(questoes[0].numero).toBe(1);
      expect(questoes[0].origem).toBe("teste4");
      expect(questoes[0].enunciado).toContain("Pergunta de teste 1");
      expect(questoes[0].correta).toBe("A");
      expect(questoes[0].metadados.bloom).toBe("Lembrar");

      expect(questoes[1].numero).toBe(2);
      expect(questoes[1].origem).toBe("teste4");
      expect(questoes[1].enunciado).toContain("Pergunta de teste 2");
      expect(questoes[1].correta).toBe("A");
    });
  });
});
