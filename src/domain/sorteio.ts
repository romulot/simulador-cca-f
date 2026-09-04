/** Modo prova: 60 questões sorteadas na proporção dos pesos do exame.
 *
 * Porte de `simulador/simulador/prova.py` (Python) para TypeScript.
 * Ver esse arquivo de referência para o contrato exato do comportamento.
 *
 * `PESOS` é a única constante deste módulo que descreve um número fixo, e
 * não contradiz a regra "nada de contagem embutida" da spec do simulador:
 * aquela regra proíbe embutir o que descreve o CORPUS (quantos simulados,
 * quantos tópicos, quantas questões). Esta tabela descreve o EXAME, que é
 * publicado e estável. O corpus continua vindo do parser.
 */
import type { Questao } from "@/lib/parser/tipos";

export const PESOS: Record<number, number> = { 1: 27, 2: 18, 3: 20, 4: 20, 5: 15 };
export const TOTAL_PROVA = 60;
export const LIMITE_SEGUNDOS = 120 * 60;

/** Gerador de números pseudoaleatórios injetável.
 *
 * Uma função `() => number` que devolve um valor em [0, 1), no mesmo
 * espírito de `random.Random()` do Python: nunca chamamos `Math.random()`
 * diretamente dentro deste módulo, para que os testes possam injetar um
 * gerador determinístico (mesma semente => mesma sequência => mesma saída
 * de `sortear`) e o código de produção possa injetar `Math.random`.
 */
export type Rng = () => number;

/** Conveniência para código de produção: embrulha `Math.random`. */
export function criarRngPadrao(): Rng {
  return () => Math.random();
}

/** Quantas questões por domínio, pelo método do maior resto.
 *
 * A tabela de pesos precisa ter soma positiva. Distribuir 60 por
 * 27/18/20/20/15 dá 16,2 / 10,8 / 12 / 12 / 9. Os pisos somam 59; a sobra
 * de 1 vai ao maior resto fracionário (D2, 0,8). O resultado soma
 * exatamente `total` — é a propriedade que o teste crava, para qualquer
 * tabela de pesos com soma positiva.
 */
export function cotas(
  pesos: Record<number, number> = PESOS,
  total: number = TOTAL_PROVA,
): Record<number, number> {
  const dominios = Object.keys(pesos).map(Number);
  const soma = dominios.reduce((acc, d) => acc + pesos[d], 0);
  if (soma <= 0 || dominios.some((d) => pesos[d] < 0)) {
    // Devolver um record que não soma `total` seria resposta errada em
    // silêncio -- o modo de falha que este módulo existe para evitar. Não
    // há distribuição defensável para "nenhum domínio tem peso": repartir
    // igualmente inventaria uma ponderação que o chamador nunca declarou.
    // `soma <= 0` sozinho não bastava: uma tabela de sinais mistos como
    // {1: -3, 2: -3, 3: 10} tem soma 4 (positiva, não levanta), mas o
    // truncamento em direção a zero encolhe os negativos, a soma das
    // bases estoura acima de `total`, e o laço de desempate então
    // INCREMENTA cotas negativas -- o mesmo record-que-não-soma-o-total em
    // silêncio, por uma porta que a guarda anterior deixava aberta.
    throw new Error(`tabela de pesos sem peso positivo: ${JSON.stringify(pesos)}`);
  }

  const exatas: Record<number, number> = {};
  for (const d of dominios) exatas[d] = (total * pesos[d]) / soma;

  const base: Record<number, number> = {};
  for (const d of dominios) base[d] = Math.trunc(exatas[d]);

  const somaBase = dominios.reduce((acc, d) => acc + base[d], 0);
  const resto = total - somaBase;

  // Desempate estável: maior resto primeiro e, empatados, menor número de
  // domínio. Sem o segundo critério a saída dependeria da ordem de
  // iteração das chaves do record de entrada.
  const ordem = [...dominios].sort((a, b) => {
    const restoA = exatas[a] - base[a];
    const restoB = exatas[b] - base[b];
    if (restoA !== restoB) return restoB - restoA;
    return a - b;
  });

  for (const d of ordem.slice(0, resto)) {
    base[d] += 1;
  }

  return base;
}

/** Questões válidas agrupadas por domínio.
 *
 * Questões cujo `dominio` é `null` (diretório que não casa `dominio-N`)
 * ficam de fora: não há peso definido para elas.
 */
export function pool(questoes: Questao[]): Record<number, Questao[]> {
  const porDominio: Record<number, Questao[]> = {};
  for (const q of questoes) {
    if (q.dominio === null) continue;
    (porDominio[q.dominio] ??= []).push(q);
  }
  return porDominio;
}

/** O que o peso pediu, o que existia e o que de fato foi sorteado. */
export interface Composicao {
  /** o que o peso pede */
  cotas: Record<number, number>;
  /** o que existe no corpus */
  disponivel: Record<number, number>;
  /** o que foi efetivamente sorteado */
  porDominio: Record<number, number>;
  /** cota - sorteado, só onde > 0 */
  deficit: Record<number, number>;
  /** já embaralhadas entre domínios */
  questoes: Questao[];
}

/** Fisher-Yates com RNG injetável: embaralha `arr` in-place em uma cópia.
 *
 * Exportada (não só interna a este módulo) porque `rodada.ts` reaproveita
 * para embaralhar a ordem das questões ao criar uma rodada de prática —
 * duplicar o mesmo Fisher-Yates ali seria a mesma lógica mantida em dois
 * lugares.
 */
export function embaralhar<T>(arr: T[], rng: Rng): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Amostra sem reposição, equivalente a `random.Random.sample` do Python:
 * `quantas` elementos distintos de `arr`, em ordem aleatória, via partial
 * Fisher-Yates (as primeiras `quantas` posições do embaralhamento).
 */
function amostrarSemReposicao<T>(arr: T[], quantas: number, rng: Rng): T[] {
  const copia = [...arr];
  const n = copia.length;
  const limite = Math.min(quantas, n);
  for (let i = 0; i < limite; i++) {
    const j = i + Math.min(n - 1 - i, Math.floor(rng() * (n - i)));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, limite);
}

/** Sorteia a prova, respeitando a cota de cada domínio.
 *
 * Déficit NUNCA é preenchido por outro domínio: completar distorceria em
 * silêncio exatamente a proporcionalidade que é a razão de existir do
 * modo, e o candidato leria "60 questões pelos pesos oficiais" olhando
 * para outra coisa. A rodada corre menor, e o déficit viaja na
 * `Composicao` até a tela de confirmação, o JSON e o relatório.
 */
export function sortear(
  questoesPorDominio: Record<number, Questao[]>,
  rng: Rng,
  pesos: Record<number, number> = PESOS,
  total: number = TOTAL_PROVA,
): Composicao {
  const alvo = cotas(pesos, total);
  const dominiosAlvo = Object.keys(alvo)
    .map(Number)
    .sort((a, b) => a - b);

  const sorteadas: Questao[] = [];
  const porDominio: Record<number, number> = {};
  const deficit: Record<number, number> = {};

  for (const dominio of dominiosAlvo) {
    const candidatas = questoesPorDominio[dominio] ?? [];
    const quantas = Math.min(alvo[dominio], candidatas.length);
    if (quantas > 0) {
      sorteadas.push(...amostrarSemReposicao(candidatas, quantas, rng));
      porDominio[dominio] = quantas;
    }
    if (alvo[dominio] - quantas > 0) {
      deficit[dominio] = alvo[dominio] - quantas;
    }
  }

  const disponivel: Record<number, number> = {};
  for (const d of Object.keys(questoesPorDominio)
    .map(Number)
    .sort((a, b) => a - b)) {
    disponivel[d] = questoesPorDominio[d].length;
  }

  return {
    cotas: alvo,
    disponivel,
    porDominio,
    deficit,
    questoes: embaralhar(sorteadas, rng),
  };
}
