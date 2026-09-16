/** Tarefa 6 — aplica a curadoria de `scripts/curadoria/dominio-N.mts` ao
 * gabarito já convertido pela Tarefa 5
 * (`content/exame-avancado/dominio-N/dominio-N_gabarito.md`), reconstruindo
 * cada bloco de questão com resumo, `**Tópicos:**` e o bloco de Metadados
 * (com `Arquétipos` quando houver). As 4 linhas de alternativa de cada
 * questão são preservadas tal como a Tarefa 5 as deixou — só o cabeçalho de
 * resposta é revalidado contra `curadoria.correta` como checagem cruzada.
 *
 * Roda com: `npx tsx scripts/aplicar-curadoria.mts <dominio>` (1 a 5).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Curadoria } from "./tipoCuradoria";

const BLOOM_SCORE: Record<Curadoria["bloom"], number> = {
  Lembrar: 1,
  Aplicar: 2,
  Analisar: 3,
  Avaliar: 4,
};

const HEADING = /^## (Q\d+) — Resposta correta: \*\*([A-D])\*\*$/;
const ALTERNATIVA = /^- \*\*([A-D]) — (errada|correta)[:.]\*\*/;

function rubrica(c: Curadoria): string {
  const bloomScore = BLOOM_SCORE[c.bloom];
  const integracao = c.topicos.length >= 2 ? 1 : 0;
  const cenarioScore = 1; // toda questão do exame-avançado é ancorada em cenário.
  const idsDistintos = new Set(Object.values(c.arquetipos)).size;
  const distratores = idsDistintos >= 2 ? 2 : idsDistintos === 1 ? 1 : 0;
  const total = bloomScore + integracao + cenarioScore + distratores;
  return `${total} = Bloom ${bloomScore} + integração ${integracao} + cenário ${cenarioScore} + distratores ${distratores}`;
}

function metadadosBloco(c: Curadoria): string[] {
  const linhas = [
    "**Metadados (revisão; não exibir ao candidato):**",
    `- Bloom: ${c.bloom}`,
    `- Dificuldade: ${c.dificuldade}`,
    `- Rubrica: ${rubrica(c)}`,
    `- Cenário: ${c.cenario}`,
    `- Princípio testado: ${c.principio}`,
  ];
  const letras = (["A", "B", "C", "D"] as const).filter((l) => c.arquetipos[l]);
  if (letras.length > 0) {
    linhas.push(`- Arquétipos: ${letras.map((l) => `${l}=${c.arquetipos[l]}`).join(", ")}`);
  }
  return linhas;
}

function reconstruirBloco(linhasOriginais: string[], c: Curadoria): string[] {
  const headingMatch = HEADING.exec(linhasOriginais[0]);
  if (!headingMatch) {
    throw new Error(`Q${c.n}: header não bate com o formato esperado: "${linhasOriginais[0]}"`);
  }
  const [, qLabel, respostaHeader] = headingMatch;
  if (respostaHeader !== c.correta) {
    throw new Error(
      `Q${c.n}: divergência entre header ("${respostaHeader}") e curadoria.correta ("${c.correta}")`,
    );
  }

  const alternativas = linhasOriginais.filter((l) => ALTERNATIVA.test(l));
  if (alternativas.length !== 4) {
    throw new Error(`Q${c.n}: esperava 4 linhas de alternativa, achou ${alternativas.length}`);
  }

  return [
    `## ${qLabel} — Resposta correta: **${respostaHeader}**`,
    "",
    c.resumo,
    "",
    ...alternativas,
    "",
    `**Tópicos:** ${c.topicos.join(", ")}`,
    "",
    ...metadadosBloco(c),
    "",
  ];
}

async function main() {
  const dominio = Number(process.argv[2]);
  if (!Number.isInteger(dominio) || dominio < 1 || dominio > 5) {
    throw new Error("uso: npx tsx scripts/aplicar-curadoria.mts <dominio 1-5>");
  }

  const { default: curadoria } = (await import(`./curadoria/dominio-${dominio}.mts`)) as {
    default: Curadoria[];
  };
  if (curadoria.length !== 60) {
    throw new Error(`dominio-${dominio}: curadoria tem ${curadoria.length} entradas, esperava 60`);
  }

  const caminho = join(
    process.cwd(),
    `content/exame-avancado/dominio-${dominio}/dominio-${dominio}_gabarito.md`,
  );
  const texto = readFileSync(caminho, "utf-8");
  const linhas = texto.split("\n");

  const indicesHeading = linhas
    .map((l, i) => (HEADING.test(l) ? i : -1))
    .filter((i) => i !== -1);
  if (indicesHeading.length !== 60) {
    throw new Error(`dominio-${dominio}: achou ${indicesHeading.length} headings "## Q", esperava 60`);
  }

  const cabecalho = linhas.slice(0, indicesHeading[0]);
  const blocosNovos: string[] = [];
  for (let i = 0; i < indicesHeading.length; i++) {
    const inicio = indicesHeading[i];
    const fim = i + 1 < indicesHeading.length ? indicesHeading[i + 1] : linhas.length;
    const bloco = linhas.slice(inicio, fim).filter((l, idx, arr) => !(l === "" && arr[idx - 1] === ""));
    blocosNovos.push(...reconstruirBloco(bloco, curadoria[i]), "---", "");
  }

  const saida = [...cabecalho, ...blocosNovos].join("\n").replace(/\n{3,}/g, "\n\n");
  writeFileSync(caminho, saida, "utf-8");
  console.log(`dominio-${dominio}: curadoria aplicada a 60 questões`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
