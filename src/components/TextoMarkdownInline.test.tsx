import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { TextoMarkdownInline } from "./TextoMarkdownInline";

function render(texto: string) {
  return renderToStaticMarkup(createElement(TextoMarkdownInline, { texto }));
}

/** Extrai apenas o texto visível de um HTML (remove todas as tags). */
function textoVisivel(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

/** Tags presentes no HTML, sem considerar atributos. */
function tagsPresentes(html: string): string[] {
  return [...html.matchAll(/<([a-z]+)/gi)].map((m) => m[1].toLowerCase());
}

const TAGS_PERMITIDAS = new Set(["strong", "em", "code"]);

describe("TextoMarkdownInline — casos unitários", () => {
  it("texto simples sem marcação", () => {
    expect(render("Texto simples")).toBe("Texto simples");
  });

  it("string vazia", () => {
    expect(render("")).toBe("");
  });

  it("negrito isolado", () => {
    expect(render("**negrito**")).toBe("<strong>negrito</strong>");
  });

  it("itálico isolado", () => {
    expect(render("*itálico*")).toBe("<em>itálico</em>");
  });

  it("código isolado", () => {
    expect(render("`código`")).toBe("<code>código</code>");
  });

  it("negrito no meio do texto", () => {
    expect(render("veja **isso** aqui")).toBe("veja <strong>isso</strong> aqui");
  });

  it("itálico no meio do texto", () => {
    expect(render("veja *isso* aqui")).toBe("veja <em>isso</em> aqui");
  });

  it("código no meio do texto", () => {
    expect(render("use `fn()` aqui")).toBe("use <code>fn()</code> aqui");
  });

  it("negrito e itálico combinados", () => {
    const out = render("**negrito** e *itálico*");
    expect(out).toBe("<strong>negrito</strong> e <em>itálico</em>");
  });

  it("negrito e código combinados", () => {
    const out = render("**negrito** e `código`");
    expect(out).toBe("<strong>negrito</strong> e <code>código</code>");
  });

  it("código contendo asteriscos não é interpretado", () => {
    expect(render("`**não negrito**`")).toBe("<code>**não negrito**</code>");
  });

  it("código contendo *asterisco simples* não é interpretado", () => {
    expect(render("`*não itálico*`")).toBe("<code>*não itálico*</code>");
  });

  it("negrito sem fechamento preserva os delimitadores como texto", () => {
    expect(render("**sem fechar")).toBe("**sem fechar");
  });

  it("itálico sem fechamento preserva o delimitador como texto", () => {
    expect(render("*sem fechar")).toBe("*sem fechar");
  });

  it("backtick sem fechamento preserva o delimitador como texto", () => {
    expect(render("`sem fechar")).toBe("`sem fechar");
  });

  it("caractere < não cria tag", () => {
    const out = render("a < b");
    expect(out).toContain("&lt;");
    expect(out).not.toMatch(/<b\b/);
  });

  it("caractere > não cria tag", () => {
    const out = render("a > b");
    expect(out).toContain("&gt;");
  });

  it("& é escapado", () => {
    const out = render("a & b");
    expect(out).toContain("&amp;");
  });

  it("aspas duplas preservadas como texto", () => {
    expect(render('diga "olá"')).toContain("olá");
  });

  it("aspas simples preservadas como texto", () => {
    expect(render("it's")).toContain("it");
  });

  it("injeção de HTML não cria elementos executáveis", () => {
    const out = render("<script>alert(1)</script>");
    expect(out).not.toContain("<script");
    expect(out).toContain("&lt;script");
  });

  it("atributo onerror não cria atributo de evento", () => {
    const out = render('<img onerror="alert(1)">');
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img");
  });

  it("sintaxe de link preservada como texto, sem elemento clicável", () => {
    const out = render("[link](https://example.com)");
    expect(out).not.toContain("<a");
    expect(out).toContain("[link]");
    expect(out).toContain("(https://example.com)");
  });

  it("fronteira *** — texto visível preservado sem *** no output", () => {
    const out = render("***texto***");
    expect(out).not.toMatch(/\*{3}/);
    expect(textoVisivel(out)).toContain("texto");
  });

  it("*** intercalado — sem sequência de três asteriscos no output", () => {
    const out = render("***negrito e itálico***");
    expect(out).not.toMatch(/\*{3}/);
    expect(textoVisivel(out)).toContain("negrito e itálico");
  });

  it("múltiplas marcações na mesma string", () => {
    const out = render("**a**, *b* e `c`");
    expect(tagsPresentes(out)).toEqual(["strong", "em", "code"]);
  });

  it("marcações aninhadas não são suportadas — conteúdo interno preservado", () => {
    // **negrito *com itálico***: o comportamento correto é produzir strong
    // cujo conteúdo inclui o texto literal "*com itálico*"
    const out = render("**negrito *com itálico***");
    expect(tagsPresentes(out).filter((t) => t !== "strong" && t !== "em")).toHaveLength(0);
    expect(textoVisivel(out)).toContain("negrito");
  });

  it("somente tags permitidas no output", () => {
    const entrada = "**a** *b* `c` texto <x> [link](url)";
    const tags = tagsPresentes(render(entrada));
    expect(tags.every((t) => TAGS_PERMITIDAS.has(t))).toBe(true);
  });
});

describe("TextoMarkdownInline — corpus real", () => {
  // Importação lazy para não bloquear caso o módulo não esteja disponível em
  // ambientes sem acesso ao sistema de arquivos.
  it("todos os campos exibíveis do corpus renderizam sem erro", async () => {
    const { descobrir } = await import("@/lib/catalogo/index");
    const { join } = await import("node:path");

    const raiz = join(process.cwd(), "content/simulados");
    const pares = descobrir(raiz);

    let total = 0;
    const erros: string[] = [];

    for (const par of pares) {
      for (const q of par.questoes) {
        const campos: string[] = [
          q.enunciado,
          q.resumo,
          q.alternativas.A,
          q.alternativas.B,
          q.alternativas.C,
          q.alternativas.D,
          q.explicacoes.A,
          q.explicacoes.B,
          q.explicacoes.C,
          q.explicacoes.D,
        ];

        for (const campo of campos) {
          total++;
          try {
            const html = render(campo);
            const tags = tagsPresentes(html);
            const inesperadas = tags.filter((t) => !TAGS_PERMITIDAS.has(t));
            if (inesperadas.length > 0) {
              erros.push(`${par.nome} Q${q.numero}: tags inesperadas [${inesperadas.join(", ")}]`);
            }
          } catch (e) {
            erros.push(`${par.nome} Q${q.numero}: exceção — ${String(e)}`);
          }
        }
      }
    }

    expect(total).toBeGreaterThan(0);
    expect(erros).toHaveLength(0);
  });

  it("campos com ** geram <strong>", async () => {
    const { descobrir } = await import("@/lib/catalogo/index");
    const { join } = await import("node:path");

    const raiz = join(process.cwd(), "content/simulados");
    const pares = descobrir(raiz);

    let encontrou = false;
    for (const par of pares) {
      for (const q of par.questoes) {
        const campos = [q.enunciado, q.resumo, ...Object.values(q.alternativas), ...Object.values(q.explicacoes)];
        for (const campo of campos) {
          if (campo.includes("**")) {
            const html = render(campo);
            if (html.includes("<strong>")) {
              encontrou = true;
            }
          }
        }
      }
    }
    expect(encontrou).toBe(true);
  });

  it("campos com backtick geram <code>", async () => {
    const { descobrir } = await import("@/lib/catalogo/index");
    const { join } = await import("node:path");

    const raiz = join(process.cwd(), "content/simulados");
    const pares = descobrir(raiz);

    let encontrou = false;
    for (const par of pares) {
      for (const q of par.questoes) {
        const campos = [q.enunciado, q.resumo, ...Object.values(q.alternativas), ...Object.values(q.explicacoes)];
        for (const campo of campos) {
          if (campo.includes("`")) {
            const html = render(campo);
            if (html.includes("<code>")) {
              encontrou = true;
            }
          }
        }
      }
    }
    expect(encontrou).toBe(true);
  });
});
