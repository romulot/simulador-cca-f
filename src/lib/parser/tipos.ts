/** Tipos do parser de conteúdo markdown (simulados/gabaritos).
 *
 * Porte de `simulador/simulador/parser.py` (Python) para TypeScript.
 * Ver esse arquivo de referência para o contrato exato do formato.
 */

export const LETRAS = ["A", "B", "C", "D"] as const;

export type Letra = (typeof LETRAS)[number];

export type AlternativasPorLetra = Record<Letra, string>;

/** Bloco "Metadados (revisão; não exibir ao candidato):" do gabarito.
 *
 * Diferente do parser Python (que descarta esse bloco, usando-o só como
 * fronteira de parada), aqui os 5 campos são capturados para alimentar
 * relatórios extras.
 */
export interface MetadadosQuestao {
  bloom: string;
  dificuldade: string;
  rubrica: string;
  cenario: string;
  principioTestado: string;
}

/** Uma questão já casada com sua entrada no gabarito. */
export interface Questao {
  /** "4.3_tool_use_schema" */
  origem: string;
  /** 4; null se o diretório não é "dominio-N" */
  dominio: number | null;
  /** numeração dentro do arquivo de origem */
  numero: number;
  enunciado: string;
  alternativas: AlternativasPorLetra;
  /** letra da alternativa correta */
  correta: Letra;
  /** parágrafo de abertura do gabarito */
  resumo: string;
  explicacoes: AlternativasPorLetra;
  metadados: MetadadosQuestao;
  /** tags curtas de tópico, uma por task statement testado (§20 do plano de
   * aprendizado) — separado de `metadados` porque, ao contrário desses
   * campos, não é "não exibir ao candidato": tópicos alimentam features
   * voltadas ao candidato (catálogo de materiais, praticar por tópico). */
  topicos: string[];
}

/** Resultado intermediário de `parseSimulado`, por questão. */
export interface QuestaoSimulado {
  numero: number;
  enunciado: string;
  alternativas: AlternativasPorLetra;
}

/** Resultado intermediário de `parseGabarito`, por questão. */
export interface QuestaoGabarito {
  numero: number;
  correta: Letra;
  resumo: string;
  explicacoes: AlternativasPorLetra;
  metadados: MetadadosQuestao;
  topicos: string[];
}
