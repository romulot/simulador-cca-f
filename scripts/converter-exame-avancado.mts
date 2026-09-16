/** Tarefa 5 do plano "Exame Avançado": conversão MECÂNICA (sem julgamento de
 * conteúdo) do par simulado/gabarito de `exame-avancado/` para o formato que
 * `src/lib/parser/parser.ts` exige.
 *
 * Lê `exame-avancado/dominio-{1..5}_{simulado,gabarito}.md` (origem,
 * intocada) e escreve em
 * `content/exame-avancado/dominio-{1..5}/dominio-{1..5}_{simulado,gabarito}.md`.
 *
 * O que este script NÃO faz, de propósito (fica para a Tarefa 6 — curadoria):
 * escrever bloco de Metadados, `**Tópicos:**` ou `Arquétipos`. O gabarito
 * convertido só é lido pelo parser depois que a Tarefa 6 preencher esses
 * campos; rodar `parseGabarito` sobre a saída deste script falha, de
 * propósito, com "bloco de metadados ausente" — não com nenhum outro erro
 * estrutural (ver critério de pronto no plano).
 *
 * Roda com: `npx tsx scripts/converter-exame-avancado.mts`.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ORIGEM = join(process.cwd(), "exame-avancado");
const DESTINO = join(process.cwd(), "content/exame-avancado");

// "### Q1" -> "## Q1" (nenhum outro texto na linha, confirmado no corpus real).
const HEADING_SIMULADO = /^### (Q\d+)$/;
// "### Q1 — Resposta: **D**" -> "## Q1 — Resposta correta: **D**".
const HEADING_GABARITO = /^### (Q\d+) — Resposta: (\*\*[A-D]\*\*)$/;
// "- **A) ❌** texto" -> "- **A — errada:** texto".
const ALTERNATIVA_ERRADA = /^- \*\*([A-D])\) ❌\*\* (.*)$/;
// "- **D) ✅** texto" -> "- **D — correta.**" (texto descartado: mesma
// convenção 100% seguida pelas 240 questões atuais — a explicação da
// alternativa correta vem do parágrafo de abertura, nunca de texto próprio
// nesta linha; ver parser.ts).
const ALTERNATIVA_CORRETA = /^- \*\*([A-D])\) ✅\*\*.*$/;
// Campo fora do contrato do parser, descartado por decisão da Tarefa 7 —
// não portado para o app (ver exame-avancado/README.md).
const PALAVRAS_GATILHO = /^\*\*Palavras-gatilho:\*\*/;

function converterSimulado(texto: string): string {
  return texto
    .split("\n")
    .map((linha) => linha.replace(HEADING_SIMULADO, "## $1"))
    .join("\n");
}

function converterGabarito(texto: string): string {
  return texto
    .split("\n")
    .filter((linha) => !PALAVRAS_GATILHO.test(linha))
    .map((linha) => {
      const heading = HEADING_GABARITO.exec(linha);
      if (heading) return `## ${heading[1]} — Resposta correta: ${heading[2]}`;

      const errada = ALTERNATIVA_ERRADA.exec(linha);
      if (errada) return `- **${errada[1]} — errada:** ${errada[2]}`;

      const correta = ALTERNATIVA_CORRETA.exec(linha);
      if (correta) return `- **${correta[1]} — correta.**`;

      return linha;
    })
    .join("\n");
}

for (let dominio = 1; dominio <= 5; dominio++) {
  const nome = `dominio-${dominio}`;
  const destinoDir = join(DESTINO, nome);
  mkdirSync(destinoDir, { recursive: true });

  const simulado = readFileSync(join(ORIGEM, `${nome}_simulado.md`), "utf-8");
  const gabarito = readFileSync(join(ORIGEM, `${nome}_gabarito.md`), "utf-8");

  writeFileSync(join(destinoDir, `${nome}_simulado.md`), converterSimulado(simulado), "utf-8");
  writeFileSync(join(destinoDir, `${nome}_gabarito.md`), converterGabarito(gabarito), "utf-8");

  console.log(`${nome}: convertido`);
}
