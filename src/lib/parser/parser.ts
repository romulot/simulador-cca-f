/** Markdown dos simulados/gabaritos -> objetos Questao.
 *
 * Porte fiel de `simulador/simulador/parser.py` (Python) para TypeScript,
 * com uma diferença deliberada: o bloco
 * "**Metadados (revisão; não exibir ao candidato):**" do gabarito, que o
 * parser Python apenas usa como fronteira de parada e descarta, aqui é
 * capturado (campos Bloom, Dificuldade, Rubrica, Cenário, Princípio testado)
 * para alimentar relatórios extras.
 *
 * Este módulo é o único lugar do app que conhece o formato do markdown.
 */
import { readFileSync, realpathSync } from "node:fs";
import { basename, dirname, resolve, sep } from "node:path";

import { FormatoInvalido } from "./erros";
import {
  type AlternativasPorLetra,
  LETRAS,
  type Letra,
  type MetadadosQuestao,
  type Questao,
  type QuestaoGabarito,
  type QuestaoSimulado,
} from "./tipos";

// "## Q1", "## Q12 — Resposta correta: **B** · (1.1)"
const QHEAD = /^##\s*Q(\d+)\b/;
// Qualquer heading de nível 2 encerra o bloco (inclui "## Autoavaliação").
const HEAD2 = /^##\s/;
// Alternativa no simulado: "- **A)** texto"
const OPT = /^-\s*\*\*([A-D])\)\*\*\s*(.*)$/;
// Letra correta no cabeçalho do gabarito.
const ANSWER = /Resposta correta:\s*\*\*([A-D])\*\*/;
// Explicação por alternativa: "- **A — errada:** texto" / "- **C — correta.**"
const EXPL = /^-\s*\*\*([A-D]) — (errada|correta)[:.]\*\*\s*(.*)$/;
// Nome de diretório de domínio, para derivar o rótulo do caminho (spec §3).
// Exportado: `src/lib/catalogo/index.ts` reaproveita para o mesmo fim
// (grupo/ordem de um `Par`), em vez de duplicar o mesmo padrão.
export const DOMINIO_RE = /^dominio-(\d+)$/;
// Tags de tópico da questão: "**Tópicos:** Tag A, Tag B" — separado do bloco
// de metadados porque, ao contrário dele, é candidato-facing.
const TOPICOS_MARCADOR = /^\*\*Tópicos:\*\*\s*(.*)$/;
// Início do bloco de metadados de revisão do gabarito.
const METADADOS_MARCADOR = /^\*\*Metadados\b/;
// Campo do bloco de metadados: "- Bloom: Aplicar" / "- Rubrica (§3): ...".
// "Arquétipos" é um sexto campo reconhecido no mesmo bloco, mas OPCIONAL
// (não entra em `obrigatorios`) e de forma diferente dos outros cinco — não
// é uma string livre, é uma lista "letra=id"; por isso tem parsing próprio
// (`parseLinhaArquetipos`) em vez de cair em `CAMPO_PARA_CHAVE`.
const METADADO_CAMPO =
  /^-\s*(Bloom|Dificuldade|Rubrica|Cenário|Princípio testado|Arquétipos)\s*(?:\(§?\d+\))?\s*:\s*(.*)$/;

const CAMPO_PARA_CHAVE: Record<string, keyof MetadadosQuestao> = {
  Bloom: "bloom",
  Dificuldade: "dificuldade",
  Rubrica: "rubrica",
  Cenário: "cenario",
  "Princípio testado": "principioTestado",
};

interface Bloco {
  numero: number;
  header: string;
  corpo: string[];
}

/** Blocos de questão do arquivo: um por heading "## Q{n}". */
function blocos(texto: string): Bloco[] {
  const linhas = texto.split("\n");
  const inicios: number[] = [];
  linhas.forEach((l, i) => {
    if (QHEAD.test(l)) inicios.push(i);
  });

  const resultado: Bloco[] = [];
  for (const i of inicios) {
    let fim = linhas.length;
    for (let j = i + 1; j < linhas.length; j++) {
      if (HEAD2.test(linhas[j])) {
        fim = j;
        break;
      }
    }
    const m = QHEAD.exec(linhas[i]);
    const numero = Number(m![1]);
    resultado.push({ numero, header: linhas[i], corpo: linhas.slice(i + 1, fim) });
  }
  return resultado;
}

/** Junta o texto de um bullet com suas linhas de continuação.
 *
 * Continuação = linha não vazia que não abre outro bullet, heading ou o
 * bloco de metadados. */
function juntar(corpo: string[], indice: number, primeiro: string): string {
  const partes = [primeiro.trim()];
  for (let k = indice + 1; k < corpo.length; k++) {
    const s = corpo[k].trim();
    if (!s || s.startsWith("- ") || s.startsWith("#") || s.startsWith("**Metadados")) {
      break;
    }
    partes.push(s);
  }
  return partes.filter((p) => p).join(" ");
}

/** Lista de questões do simulado, na ordem do arquivo. */
export function parseSimulado(texto: string, arquivo = "<memória>"): QuestaoSimulado[] {
  const resultado: QuestaoSimulado[] = [];

  for (const { numero, corpo } of blocos(texto)) {
    const primeiraOpcao = corpo.findIndex((l) => OPT.test(l.trim()));
    if (primeiraOpcao === -1) {
      throw new FormatoInvalido(arquivo, numero, "nenhuma alternativa '- **A)** ...'");
    }
    const enunciado = corpo.slice(0, primeiraOpcao).join("\n").trim();
    if (!enunciado) {
      throw new FormatoInvalido(arquivo, numero, "enunciado vazio");
    }

    const alternativas = {} as AlternativasPorLetra;
    corpo.forEach((linha, i) => {
      const m = OPT.exec(linha.trim());
      if (!m) return;
      const letra = m[1] as Letra;
      if (letra in alternativas) {
        throw new FormatoInvalido(arquivo, numero, `alternativa ${letra} duplicada`);
      }
      alternativas[letra] = juntar(corpo, i, m[2]);
    });

    const faltando = LETRAS.filter((l) => !(l in alternativas));
    if (faltando.length > 0) {
      throw new FormatoInvalido(arquivo, numero, `faltam alternativas ${JSON.stringify(faltando)}`);
    }
    const vazias = LETRAS.filter((l) => !alternativas[l]);
    if (vazias.length > 0) {
      throw new FormatoInvalido(arquivo, numero, `alternativas vazias ${JSON.stringify(vazias)}`);
    }

    resultado.push({ numero, enunciado, alternativas });
  }

  return resultado;
}

/** Parseia a linha "- Arquétipos: A=id, C=id" — só as letras ERRADAS podem
 * aparecer, cada `id` é validado só na FORMA (kebab-case), nunca contra o
 * conjunto canônico de `domain/arquetipos.ts`: mesma filosofia de
 * `**Tópicos:**`, que também não valida contra o catálogo em tempo de
 * parse (um id desconhecido é um problema de qualidade de conteúdo,
 * pego por teste de integridade do corpus, não um erro estrutural de
 * formato). Linha vazia (`Arquétipos:` sem nada depois) é válida e
 * significa "ainda não tagueado". */
function parseLinhaArquetipos(
  texto: string,
  arquivo: string,
  numero: number,
  correta: Letra,
): Partial<Record<Letra, string>> {
  const resultado: Partial<Record<Letra, string>> = {};
  const pares = texto
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  for (const par of pares) {
    const m = /^([A-D])\s*=\s*([a-z][a-z0-9-]*)$/.exec(par);
    if (!m) {
      throw new FormatoInvalido(arquivo, numero, `entrada de arquétipo mal formada: "${par}"`);
    }
    const letra = m[1] as Letra;
    if (letra === correta) {
      throw new FormatoInvalido(
        arquivo,
        numero,
        `arquétipo não pode marcar a alternativa correta (${letra})`,
      );
    }
    if (letra in resultado) {
      throw new FormatoInvalido(arquivo, numero, `arquétipo da alternativa ${letra} duplicado`);
    }
    resultado[letra] = m[2];
  }

  return resultado;
}

/** Encontra e valida o bloco "**Metadados ...**" de uma questão do gabarito.
 *
 * Também captura, do mesmo bloco, a linha OPCIONAL "Arquétipos" (ver
 * `parseLinhaArquetipos`) — por isso devolve os dois resultados juntos: um
 * único laço sobre o bloco, em vez de escanear duas vezes. */
function parseMetadados(
  corpo: string[],
  arquivo: string,
  numero: number,
  correta: Letra,
): { metadados: MetadadosQuestao; arquetiposErrados: Partial<Record<Letra, string>> } {
  const marcador = corpo.findIndex((l) => METADADOS_MARCADOR.test(l.trim()));
  if (marcador === -1) {
    throw new FormatoInvalido(arquivo, numero, "bloco de metadados ausente");
  }

  const campos: Partial<Record<keyof MetadadosQuestao, string>> = {};
  let arquetiposErrados: Partial<Record<Letra, string>> = {};
  let arquetiposVistos = false;
  for (let k = marcador + 1; k < corpo.length; k++) {
    const linha = corpo[k].trim();
    if (!linha) break;
    const m = METADADO_CAMPO.exec(linha);
    if (!m) break;

    if (m[1] === "Arquétipos") {
      if (arquetiposVistos) {
        throw new FormatoInvalido(arquivo, numero, "campo de metadados Arquétipos duplicado");
      }
      arquetiposVistos = true;
      arquetiposErrados = parseLinhaArquetipos(m[2].trim(), arquivo, numero, correta);
      continue;
    }

    const chave = CAMPO_PARA_CHAVE[m[1]];
    if (chave in campos) {
      throw new FormatoInvalido(arquivo, numero, `campo de metadados ${m[1]} duplicado`);
    }
    campos[chave] = m[2].trim();
  }

  const obrigatorios: (keyof MetadadosQuestao)[] = [
    "bloom",
    "dificuldade",
    "rubrica",
    "cenario",
    "principioTestado",
  ];
  const faltando = obrigatorios.filter((c) => !campos[c]);
  if (faltando.length > 0) {
    throw new FormatoInvalido(arquivo, numero, `faltam campos de metadados ${JSON.stringify(faltando)}`);
  }

  return { metadados: campos as MetadadosQuestao, arquetiposErrados };
}

/** Encontra e valida a linha "**Tópicos:** ..." de uma questão do gabarito.
 *
 * Roda depois de `parseMetadados` (não antes): assim, um gabarito sem bloco
 * de metadados algum continua reportando "metadados ausente" (o erro mais
 * genérico e anterior), em vez de ser mascarado por "tópicos ausentes". */
function parseTopicos(corpo: string[], arquivo: string, numero: number): string[] {
  const linha = corpo.find((l) => TOPICOS_MARCADOR.test(l.trim()));
  if (linha === undefined) {
    throw new FormatoInvalido(arquivo, numero, "linha '**Tópicos:**' ausente");
  }
  const m = TOPICOS_MARCADOR.exec(linha.trim())!;
  const topicos = m[1]
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (topicos.length === 0) {
    throw new FormatoInvalido(arquivo, numero, "'**Tópicos:**' sem nenhum tópico");
  }
  return topicos;
}

/** Lista de questões do gabarito, na ordem do arquivo. */
export function parseGabarito(texto: string, arquivo = "<memória>"): QuestaoGabarito[] {
  const resultado: QuestaoGabarito[] = [];

  for (const { numero, header, corpo } of blocos(texto)) {
    const m = ANSWER.exec(header);
    if (!m) {
      throw new FormatoInvalido(arquivo, numero, "header sem 'Resposta correta: **X**'");
    }
    const correta = m[1] as Letra;

    const primeira = corpo.findIndex((l) => EXPL.test(l.trim()));
    if (primeira === -1) {
      throw new FormatoInvalido(
        arquivo,
        numero,
        "nenhuma explicação '- **X — errada:** ...' (formato antigo?)",
      );
    }
    const resumo = corpo.slice(0, primeira).join("\n").trim();
    if (!resumo) {
      throw new FormatoInvalido(arquivo, numero, "parágrafo de abertura vazio");
    }

    const explicacoes = {} as AlternativasPorLetra;
    const rotulos: Partial<Record<Letra, string>> = {};
    corpo.forEach((linha, i) => {
      const em = EXPL.exec(linha.trim());
      if (!em) return;
      const letra = em[1] as Letra;
      if (letra in explicacoes) {
        throw new FormatoInvalido(arquivo, numero, `explicação ${letra} duplicada`);
      }
      rotulos[letra] = em[2];
      explicacoes[letra] = juntar(corpo, i, em[3]);
    });

    const faltando = LETRAS.filter((l) => !(l in explicacoes));
    if (faltando.length > 0) {
      throw new FormatoInvalido(arquivo, numero, `faltam explicações ${JSON.stringify(faltando)}`);
    }
    const marcadas = LETRAS.filter((l) => rotulos[l] === "correta");
    if (!(marcadas.length === 1 && marcadas[0] === correta)) {
      throw new FormatoInvalido(
        arquivo,
        numero,
        `rótulo 'correta' em ${marcadas.length > 0 ? JSON.stringify(marcadas) : "nenhuma"}, header diz ${correta}`,
      );
    }

    // A linha da correta não traz texto próprio (rule §8) -> a explicação
    // dela é o parágrafo de abertura.
    if (!explicacoes[correta]) {
      explicacoes[correta] = resumo;
    }
    const vazias = LETRAS.filter((l) => !explicacoes[l]);
    if (vazias.length > 0) {
      throw new FormatoInvalido(arquivo, numero, `explicações vazias ${JSON.stringify(vazias)}`);
    }

    const { metadados, arquetiposErrados } = parseMetadados(corpo, arquivo, numero, correta);
    const topicos = parseTopicos(corpo, arquivo, numero);

    resultado.push({ numero, correta, resumo, explicacoes, metadados, topicos, arquetiposErrados });
  }

  return resultado;
}

// Raízes de conteúdo permitidas, resolvidas a partir do cwd do processo (que
// o Next.js — em dev, build e start — sempre mantém como a raiz do projeto;
// é a mesma convenção já usada em parser.test.ts). Evita hardcode de caminho
// de máquina e serve de base para a guarda de path traversal abaixo.
// `realpathSync` (em vez de `resolve`) segue symlinks, para que cada raiz
// comparada abaixo já esteja no mesmo espaço "resolvido" do caminho do
// arquivo. Lista fixa no código (nunca construída a partir de input externo)
// — uma raiz por trilha de conteúdo (ver `lib/catalogo/index.ts`).
const CONTEUDO_RAIZES = ["content/simulados", "content/exame-avancado"].map(
  (raiz) => realpathSync(resolve(process.cwd(), raiz)) + sep,
);

/** Garante que `caminho`, depois de resolvido, fica dentro de alguma das
 * raízes de `CONTEUDO_RAIZES`. Usa `realpathSync` (em vez de `resolve`) para
 * que symlinks dentro do diretório de conteúdo apontando para fora sejam
 * seguidos antes da comparação — do contrário, um symlink escaparia da
 * checagem `startsWith` mas ainda seria seguido por `readFileSync`. Lança
 * `FormatoInvalido` (reaproveitado em vez de um erro dedicado: o chamador de
 * `carregarPar` já trata só esse tipo de erro) se o caminho escapar de todas
 * as raízes permitidas. Se `caminho` não existir ou for inacessível,
 * `realpathSync` lança um erro cru do Node (`ENOENT` etc.); esse erro é
 * capturado e relançado como `FormatoInvalido` para preservar o contrato de
 * que toda a superfície pública do módulo só lança esse tipo. */
function validarDentroDoConteudo(caminho: string): string {
  let resolvido: string;
  try {
    resolvido = realpathSync(caminho);
  } catch {
    throw new FormatoInvalido(
      basename(caminho),
      null,
      "caminho inexistente ou inacessível",
    );
  }
  if (!CONTEUDO_RAIZES.some((raiz) => resolvido.startsWith(raiz))) {
    throw new FormatoInvalido(
      basename(caminho),
      null,
      "caminho fora do diretório de conteúdo permitido",
    );
  }
  return resolvido;
}

/** Lê um par simulado/gabarito do disco e retorna as questões já casadas
 * questão a questão. */
export function carregarPar(caminhoSimulado: string, caminhoGabarito: string): Questao[] {
  const simuladoValidado = validarDentroDoConteudo(caminhoSimulado);
  const gabaritoValidado = validarDentroDoConteudo(caminhoGabarito);

  const nomeArquivoSimulado = basename(caminhoSimulado);
  const nomeArquivoGabarito = basename(caminhoGabarito);
  const nome = nomeArquivoSimulado.replace(/_simulado\.md$/, "");

  const textoSimulado = readFileSync(simuladoValidado, "utf-8");
  const textoGabarito = readFileSync(gabaritoValidado, "utf-8");

  const questoesSim = parseSimulado(textoSimulado, nomeArquivoSimulado);
  const questoesGab = parseGabarito(textoGabarito, nomeArquivoGabarito);

  if (questoesSim.length !== questoesGab.length) {
    throw new FormatoInvalido(
      nome,
      null,
      `${questoesSim.length} questões no simulado vs ${questoesGab.length} respostas no gabarito`,
    );
  }

  const mDominio = DOMINIO_RE.exec(basename(dirname(caminhoSimulado)));
  const dominio = mDominio ? Number(mDominio[1]) : null;

  const questoes: Questao[] = [];
  for (let i = 0; i < questoesSim.length; i++) {
    const q = questoesSim[i];
    const g = questoesGab[i];
    if (q.numero !== g.numero) {
      throw new FormatoInvalido(nome, q.numero, `gabarito traz Q${g.numero} nesta posição`);
    }
    questoes.push({
      origem: nome,
      dominio,
      numero: q.numero,
      enunciado: q.enunciado,
      alternativas: q.alternativas,
      correta: g.correta,
      resumo: g.resumo,
      explicacoes: g.explicacoes,
      metadados: g.metadados,
      topicos: g.topicos,
      arquetiposErrados: g.arquetiposErrados,
    });
  }

  return questoes;
}
