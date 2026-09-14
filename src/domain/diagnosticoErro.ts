/** Classificador de erro por tempo — CONCEITO vs. DESATENÇÃO, e sinal de
 * FADIGA no nível da rodada.
 *
 * Porte de `.claude/skills/corrigir-rodada/scripts/extrair_erros.py` (no
 * laboratório de estudos `claude-cca-f-estudos`) para TypeScript. O
 * diagnóstico central é o TEMPO: comparar quanto durou cada questão errada
 * com a média da rodada separa lacuna de conceito (questão lenta) de
 * desatenção (questão rápida) — os dois pedem tratamentos opostos, e
 * confundi-los faz o candidato reestudar o que já sabe.
 *
 * Função pura sobre os fatos já gravados por questão (segundos, resposta,
 * correta) — nunca lê banco nem filesystem, mesmo espírito de
 * `domain/aprendizado.ts`.
 */

export type ClassificacaoErro = "conceito" | "desatencao";

export interface QuestaoParaDiagnostico {
  posicao: number;
  segundos: number;
  resposta: string | null;
  correta: string;
}

export interface DiagnosticoQuestao {
  posicao: number;
  segundos: number;
  /** "conceito" quando o tempo da questão errada ficou ACIMA da média da
   * rodada (ficou preso, não sabia); "desatencao" quando ficou na média ou
   * abaixo (respondeu rápido e errado — leu mal). */
  classificacao: ClassificacaoErro;
}

/** Sinal de rodada inteira, quando todos os erros apontam para a mesma
 * causa — só faz sentido com pelo menos 1 erro. */
export type SinalGeral = "todas_desatencao" | "todas_conceito" | null;

export interface DiagnosticoRodada {
  /** Segundos, média de TODAS as questões da rodada (respondidas ou não) —
   * mesmo denominador do script de referência, para que uma questão em
   * branco (tempo visitado mas não respondido) ainda pese na média. */
  mediaSegundos: number;
  /** Só as questões erradas (resposta não nula e diferente da correta),
   * na ordem em que aparecem na rodada. */
  erros: DiagnosticoQuestao[];
  /** True quando mais de 1/4 das questões da rodada passaram de 2× a
   * média — indício de que a sessão continuou além do ponto de
   * rendimento, não de lacuna de conteúdo. */
  fadiga: boolean;
  sinalGeral: SinalGeral;
}

const FATOR_FADIGA = 2;

export function diagnosticarErros(questoes: QuestaoParaDiagnostico[]): DiagnosticoRodada {
  if (questoes.length === 0) {
    return { mediaSegundos: 0, erros: [], fadiga: false, sinalGeral: null };
  }

  const mediaSegundos =
    questoes.reduce((acc, q) => acc + q.segundos, 0) / questoes.length;

  const erros: DiagnosticoQuestao[] = questoes
    .filter((q) => q.resposta !== null && q.resposta !== q.correta)
    .map((q) => ({
      posicao: q.posicao,
      segundos: q.segundos,
      classificacao: (q.segundos > mediaSegundos ? "conceito" : "desatencao") as ClassificacaoErro,
    }));

  // `// 4` do Python é divisão inteira (piso) — replicado com Math.floor
  // para não relaxar o limiar por arredondamento (ex.: 6 questões, 1.5 ->
  // sem Math.floor o limiar viraria 1.5 e 2 lentas já disparariam fadiga
  // cedo demais; com floor, o limiar é 1, então 2 lentas continuam
  // disparando, mas 1 lenta sozinha não passa a disparar por engano).
  const limiteFadiga = Math.floor(questoes.length / 4);
  const lentasDemais = questoes.filter((q) => q.segundos > FATOR_FADIGA * mediaSegundos).length;
  const fadiga = lentasDemais > limiteFadiga;

  let sinalGeral: SinalGeral = null;
  if (erros.length > 0) {
    if (erros.every((e) => e.classificacao === "desatencao")) {
      sinalGeral = "todas_desatencao";
    } else if (erros.every((e) => e.classificacao === "conceito")) {
      sinalGeral = "todas_conceito";
    }
  }

  return { mediaSegundos, erros, fadiga, sinalGeral };
}
