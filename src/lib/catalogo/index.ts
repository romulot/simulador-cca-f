/** Descoberta dos pares simulado/gabarito em `content/simulados/`.
 *
 * Porte de `simulador/simulador/catalogo.py`. Tudo por varredura em tempo
 * de execução: nenhuma lista embutida de arquivos, tópicos ou domínios — um
 * `dominio-6/` novo, ou um diretório com outro nome, aparece sozinho.
 *
 * Diferente de `src/lib/parser/parser.ts` (que só sabe ler UM par dado seu
 * caminho), este módulo é quem decide QUAIS caminhos existem — por isso lê
 * diretório (`readdirSync`), não arquivo.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { DOMINIO_RE } from "@/lib/parser/parser";
import { carregarPar } from "@/lib/parser/parser";
import { FormatoInvalido } from "@/lib/parser/erros";
import type { Questao } from "@/lib/parser/tipos";

// Pares sem domínio identificável vão para o fim da lista.
const SEM_DOMINIO = Number.MAX_SAFE_INTEGER;

const RAIZ_PADRAO = join(process.cwd(), "content/simulados");

/** Um par simulado/gabarito descoberto no disco, válido ou não. */
export interface Par {
  /** "4.3_tool_use_schema" */
  nome: string;
  /** "4.3 tool use schema" */
  rotulo: string;
  /** "Domínio 4" ou o nome do diretório, se não casar "dominio-N". */
  grupo: string;
  /** Chave de ordenação estável: (domínio ou SEM_DOMINIO, nome do diretório). */
  ordem: readonly [number, string];
  /** Vazio quando `erro` não é null. */
  questoes: Questao[];
  /** Motivo de o par não ser utilizável; null quando válido. */
  erro: string | null;
}

function rotulo(nome: string): string {
  if (nome.endsWith("_revisao")) return "revisão do domínio";
  return nome.replaceAll("_", " ");
}

/** Nomes de arquivo terminados em `_simulado.md`, em qualquer profundidade
 * sob `raiz` — equivalente a `Path.rglob("*_simulado.md")` do Python. */
function encontrarSimulados(raiz: string): string[] {
  const encontrados: string[] = [];

  function visitar(diretorio: string): void {
    let entradas;
    try {
      entradas = readdirSync(diretorio, { withFileTypes: true });
    } catch {
      return; // raiz inexistente/inacessível: sem pares, não é erro fatal do app
    }
    for (const entrada of entradas) {
      const caminho = join(diretorio, entrada.name);
      if (entrada.isDirectory()) {
        visitar(caminho);
      } else if (entrada.isFile() && entrada.name.endsWith("_simulado.md")) {
        encontrados.push(caminho);
      }
    }
  }

  visitar(raiz);
  return encontrados;
}

/** Todos os pares sob `raiz` (default: `content/simulados/`), ordenados por
 * domínio e depois por nome de arquivo. */
export function descobrir(raiz: string = RAIZ_PADRAO): Par[] {
  const caminhosSimulado = encontrarSimulados(raiz);

  const pares: Par[] = caminhosSimulado.map((caminhoSimulado) => {
    const nomeArquivo = caminhoSimulado.split("/").pop()!;
    const nome = nomeArquivo.replace(/_simulado\.md$/, "");
    const diretorio = caminhoSimulado.slice(0, caminhoSimulado.length - nomeArquivo.length - 1);
    const nomeDiretorio = diretorio.split("/").pop()!;
    const caminhoGabarito = join(diretorio, `${nome}_gabarito.md`);

    const mDominio = DOMINIO_RE.exec(nomeDiretorio);
    const dominio = mDominio ? Number(mDominio[1]) : null;
    const grupo = dominio !== null ? `Domínio ${dominio}` : nomeDiretorio;
    const ordem = [dominio ?? SEM_DOMINIO, nomeDiretorio] as const;

    let erro: string | null = null;
    let questoes: Questao[] = [];
    try {
      questoes = carregarPar(caminhoSimulado, caminhoGabarito);
    } catch (e) {
      if (e instanceof FormatoInvalido) {
        erro = e.questao === null ? e.motivo : `Q${e.questao}: ${e.motivo}`;
      } else {
        erro = `erro de leitura: ${(e as Error).message}`;
      }
    }

    // Zero questões (tópico em rascunho, sem "## Q" nenhum) parseia limpo
    // dos dois lados e as contagens batem — sem este passo o par entraria
    // como válido e a seleção poderia iniciar uma rodada vazia.
    if (erro === null && questoes.length === 0) {
      erro = "nenhuma questão";
    }

    return { nome, rotulo: rotulo(nome), grupo, ordem, questoes, erro };
  });

  return pares.sort((a, b) => {
    if (a.ordem[0] !== b.ordem[0]) return a.ordem[0] - b.ordem[0];
    if (a.ordem[1] !== b.ordem[1]) return a.ordem[1] < b.ordem[1] ? -1 : 1;
    return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
  });
}

/** Pares agrupados por `grupo`, preservando a ordem de `descobrir`. */
export function agrupar(pares: Par[]): Array<[string, Par[]]> {
  const grupos: Array<[string, Par[]]> = [];
  for (const par of pares) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo[0] === par.grupo) {
      ultimo[1].push(par);
    } else {
      grupos.push([par.grupo, [par]]);
    }
  }
  return grupos;
}
