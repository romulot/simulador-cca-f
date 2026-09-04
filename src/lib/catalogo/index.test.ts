import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { agrupar, descobrir } from "./index";

const RAIZ_REAL = join(process.cwd(), "content/simulados");

describe("descobrir — corpus real", () => {
  it("encontra os 35 pares reais, todos válidos, somando 240 questões", () => {
    const pares = descobrir(RAIZ_REAL);
    expect(pares).toHaveLength(35);
    expect(pares.every((p) => p.erro === null)).toBe(true);

    const totalQuestoes = pares.reduce((acc, p) => acc + p.questoes.length, 0);
    expect(totalQuestoes).toBe(240);
  });

  it("agrupa em 5 domínios, na ordem 1..5", () => {
    const pares = descobrir(RAIZ_REAL);
    const grupos = agrupar(pares);
    expect(grupos.map(([nome]) => nome)).toEqual([
      "Domínio 1",
      "Domínio 2",
      "Domínio 3",
      "Domínio 4",
      "Domínio 5",
    ]);
    // Nenhum grupo vazio, nenhum par perdido na hora de agrupar.
    const totalNosGrupos = grupos.reduce((acc, [, ps]) => acc + ps.length, 0);
    expect(totalNosGrupos).toBe(pares.length);
  });

  it("rótulo de um tópico normal troca '_' por espaço; de revisão vira 'revisão do domínio'", () => {
    const pares = descobrir(RAIZ_REAL);
    const topico = pares.find((p) => p.nome === "1.1_loop_agentico");
    const revisao = pares.find((p) => p.nome === "dominio-1_revisao");
    expect(topico?.rotulo).toBe("1.1 loop agentico");
    expect(revisao?.rotulo).toBe("revisão do domínio");
  });
});

describe("descobrir — pares quebrados não derrubam a descoberta", () => {
  const dirFixture = join(RAIZ_REAL, "_fixture-catalogo");

  afterEach(() => {
    rmSync(dirFixture, { recursive: true, force: true });
  });

  it("gabarito ausente aparece com erro, sem interromper os demais", () => {
    mkdirSync(dirFixture, { recursive: true });
    writeFileSync(
      join(dirFixture, "orfao_simulado.md"),
      "# Simulado\n\n## Q1\nEnunciado.\n\n- **A)** a\n- **B)** b\n- **C)** c\n- **D)** d\n",
    );
    // sem o _gabarito.md correspondente

    const pares = descobrir(RAIZ_REAL);
    const orfao = pares.find((p) => p.nome === "orfao");
    expect(orfao).toBeDefined();
    expect(orfao!.erro).not.toBeNull();
    expect(orfao!.questoes).toEqual([]);

    // os pares reais continuam presentes e válidos
    expect(pares.filter((p) => p.nome !== "orfao" && p.erro === null)).toHaveLength(35);
  });

  it("zero questões no par (nenhum '## Q') vira erro 'nenhuma questão', não par vazio válido", () => {
    mkdirSync(dirFixture, { recursive: true });
    writeFileSync(join(dirFixture, "vazio_simulado.md"), "# Rascunho, ainda sem questões\n");
    writeFileSync(join(dirFixture, "vazio_gabarito.md"), "# Rascunho, ainda sem questões\n");

    const pares = descobrir(RAIZ_REAL);
    const vazio = pares.find((p) => p.nome === "vazio");
    expect(vazio?.erro).toBe("nenhuma questão");
  });

  it("diretório que não casa 'dominio-N' vira grupo pelo próprio nome, dominio=null nas questões", () => {
    mkdirSync(dirFixture, { recursive: true });
    writeFileSync(
      join(dirFixture, "solto_simulado.md"),
      "# Simulado\n\n## Q1\nEnunciado.\n\n- **A)** a\n- **B)** b\n- **C)** c\n- **D)** d\n",
    );
    writeFileSync(
      join(dirFixture, "solto_gabarito.md"),
      [
        "# Gabarito — Q1 — Resposta correta: **A**",
        "",
        "## Q1 — Resposta correta: **A**",
        "Resumo.",
        "",
        "- **A — correta.**",
        "- **B — errada:** errada.",
        "- **C — errada:** errada.",
        "- **D — errada:** errada.",
        "",
        "**Metadados (revisão; não exibir ao candidato):**",
        "- Bloom: Lembrar",
        "- Dificuldade: Fácil",
        "- Rubrica: r",
        "- Cenário: c",
        "- Princípio testado: p",
        "",
      ].join("\n"),
    );

    const pares = descobrir(RAIZ_REAL);
    const solto = pares.find((p) => p.nome === "solto");
    expect(solto?.erro).toBeNull();
    expect(solto?.grupo).toBe("_fixture-catalogo");
    expect(solto?.questoes[0]?.dominio).toBeNull();
  });
});
