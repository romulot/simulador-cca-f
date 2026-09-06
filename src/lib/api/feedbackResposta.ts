/** Feedback exposto ao candidato depois que ele respondeu uma questão.
 *
 * Só é seguro incluir isto numa resposta de API quando a questão em
 * `posicao` JÁ foi respondida E a rodada está no modo prática — nunca antes
 * de responder (spoiler) e nunca no modo prova (lá, resposta certa e
 * explicação só aparecem depois que a rodada inteira encerra; ver
 * `detalheRodada.ts`). Quem decide QUANDO incluir é o chamador (a rota); este
 * módulo só monta o formato.
 */
import type { AlternativasPorLetra, Letra, Questao } from "@/lib/parser/tipos";

export interface FeedbackResposta {
  correta: Letra;
  explicacoes: AlternativasPorLetra;
}

export function paraFeedbackResposta(questao: Questao): FeedbackResposta {
  return {
    correta: questao.correta,
    explicacoes: questao.explicacoes,
  };
}
