/** Estado de uma rodada: ordem, respostas, tempo por questão, placar.
 *
 * Porte de `simulador/simulador/sessao.py` (Python) para TypeScript. Ver
 * esse arquivo de referência para o raciocínio completo por trás de cada
 * regra (navegação bidirecional sem wrap, tempo por visita — não por
 * resposta —, encerramento explícito nunca igual a "tudo respondido").
 *
 * Diferença de design em relação ao original: lá é uma classe com estado
 * mutável e um `_relogio` capturado em closure; aqui é um estado plano e
 * serializável (`RodadaEstado`) e funções puras que devolvem um novo
 * estado. Isso importa porque este estado vai ser persistido em SQLite
 * entre requisições HTTP (cada chamada de API roda num processo sem
 * memória da chamada anterior) — um objeto plano sobrevive a
 * serialização/desserialização; uma classe com função de relógio capturada
 * não sobreviveria.
 */
import type { Letra, Questao } from "@/lib/parser/tipos";
import { embaralhar, type Rng } from "./sorteio";

export const MODO_PRATICA = "pratica" as const;
export const MODO_PROVA = "prova" as const;
export type Modo = typeof MODO_PRATICA | typeof MODO_PROVA;

/** Relógio injetável: segundos (ponto flutuante), no espírito de
 * `time.monotonic` do Python — não precisa ser hora de parede, só
 * monotônico e substituível em teste. */
export type Relogio = () => number;

/** Conveniência para código de produção. */
export function relogioPadrao(): Relogio {
  return () => Date.now() / 1000;
}

/** Relógio para usar com uma `RodadaEstado` que já tem `fimEm !== null`
 * (uma rodada finalizada) — nenhuma função de domínio consulta o relógio
 * de novo nesse caso (`decorrido()`/`esgotado()` já leem `fimEm`
 * diretamente). Lança se for chamado mesmo assim, para que um uso indevido
 * apareça como erro com stack trace claro, em vez de silenciosamente ler
 * `Date.now()` e mascarar o bug de quem esqueceu de restaurar a rodada
 * como finalizada antes de calcular o placar. */
export function relogioInerte(): Relogio {
  return () => {
    throw new Error(
      "relogioInerte: não deveria ser consultado — só use com uma RodadaEstado já finalizada (fimEm !== null)",
    );
  };
}

export interface RodadaEstado {
  questoes: Questao[];
  respostas: (Letra | null)[];
  tempos: number[];
  indice: number;
  modo: Modo;
  limiteSegundos: number | null;
  esgotouTempo: boolean;
  /** null antes de `iniciar`. */
  inicioEm: number | null;
  /** marca do último ponto de referência do cronômetro (questão em cena). */
  marcaEm: number | null;
  /** null enquanto em andamento; congela `decorrido()` quando setado. */
  fimEm: number | null;
}

/** Resultado da rodada, com os dois denominadores.
 *
 * Quem escolhe qual é a manchete é a camada de relatório, pelo modo: no
 * modo prova o exame conta em branco como erro (denominador = `total`), na
 * prática o denominador é o que foi respondido.
 */
export interface Placar {
  total: number;
  respondidas: number;
  emBranco: number;
  acertos: number;
  erros: number;
  /** sobre respondidas; null se nenhuma */
  percentual: number | null;
  /** sobre o total; null se a rodada é vazia */
  percentualTotal: number | null;
  tempoTotal: number;
}

export interface CriarRodadaOpcoes {
  modo?: Modo;
  limiteSegundos?: number | null;
  embaralhar?: boolean;
  /** obrigatório se `embaralhar` for true (default). */
  rng?: Rng;
}

/** Cria uma rodada nova. O cronômetro NÃO começa aqui — chame `iniciar`
 * separadamente, como no original (permite montar a rodada e só depois
 * disparar o relógio quando a tela de questão for de fato exibida). */
export function criarRodada(
  questoes: Questao[],
  opcoes: CriarRodadaOpcoes = {},
): RodadaEstado {
  const {
    modo = MODO_PRATICA,
    limiteSegundos = null,
    embaralhar: deveEmbaralhar = true,
    rng,
  } = opcoes;

  if (deveEmbaralhar && !rng) {
    throw new Error("criarRodada: 'rng' é obrigatório quando embaralhar=true");
  }

  const ordenadas = deveEmbaralhar && rng ? embaralhar(questoes, rng) : [...questoes];

  return {
    questoes: ordenadas,
    respostas: ordenadas.map(() => null),
    tempos: ordenadas.map(() => 0),
    indice: 0,
    modo,
    limiteSegundos,
    esgotouTempo: false,
    inicioEm: null,
    marcaEm: null,
    fimEm: null,
  };
}

/** Dispara o cronômetro na primeira questão. */
export function iniciar(estado: RodadaEstado, relogio: Relogio): RodadaEstado {
  const agora = relogio();
  return { ...estado, inicioEm: agora, marcaEm: agora };
}

/** Fecha o trecho aberto na questão atual, somando ao tempo dela, e
 * reposiciona a marca.
 *
 * Único lugar que soma tempo. Chamado ao SAIR de uma questão — por
 * `irPara` e por `encerrar` —, que são os dois únicos caminhos de saída.
 * Sem a chamada em `encerrar`, o tempo da última questão visitada se
 * perderia.
 */
function registrarTempo(estado: RodadaEstado, relogio: Relogio): RodadaEstado {
  if (estado.marcaEm === null || estado.fimEm !== null) return estado;
  const agora = relogio();
  const tempos = [...estado.tempos];
  tempos[estado.indice] += agora - estado.marcaEm;
  return { ...estado, tempos, marcaEm: agora };
}

/** Segundos desde `iniciar()`, congelados após `encerrar()`. */
export function decorrido(estado: RodadaEstado, relogio: Relogio): number {
  if (estado.inicioEm === null) return 0;
  const fim = estado.fimEm !== null ? estado.fimEm : relogio();
  return fim - estado.inicioEm;
}

/** Segundos até o limite; null no modo prática (sem limite). */
export function restante(estado: RodadaEstado, relogio: Relogio): number | null {
  if (estado.limiteSegundos === null) return null;
  return Math.max(0, estado.limiteSegundos - decorrido(estado, relogio));
}

/** True quando a rodada tem limite e ele foi atingido. */
export function esgotado(estado: RodadaEstado, relogio: Relogio): boolean {
  return estado.limiteSegundos !== null && decorrido(estado, relogio) >= estado.limiteSegundos;
}

/** True quando a rodada acabou — por ato explícito, por tempo esgotado, ou
 * por nunca ter tido questão nenhuma.
 *
 * NUNCA equivalente a `tudoRespondido`: recusar a confirmação de
 * encerramento deixaria a rodada encerrada assim mesmo.
 */
export function encerrada(estado: RodadaEstado, relogio: Relogio): boolean {
  return estado.questoes.length === 0 || estado.fimEm !== null || esgotado(estado, relogio);
}

/** Questão em exibição, ou null se a rodada acabou. */
export function atual(estado: RodadaEstado, relogio: Relogio): Questao | null {
  if (encerrada(estado, relogio)) return null;
  return estado.questoes[estado.indice];
}

/** Move o cursor, fechando o tempo da questão que sai de cena.
 *
 * Sem wraparound: índice fora de faixa, ou igual ao atual, não faz nada.
 */
export function irPara(estado: RodadaEstado, indice: number, relogio: Relogio): RodadaEstado {
  if (indice < 0 || indice >= estado.questoes.length || indice === estado.indice) {
    return estado;
  }
  const comTempoFechado = registrarTempo(estado, relogio);
  return { ...comTempoFechado, indice };
}

/** Próxima questão; na última, não faz nada (sem wrap). */
export function avancar(estado: RodadaEstado, relogio: Relogio): RodadaEstado {
  return irPara(estado, estado.indice + 1, relogio);
}

/** Questão anterior; na primeira, não faz nada (sem wrap). */
export function voltar(estado: RodadaEstado, relogio: Relogio): RodadaEstado {
  return irPara(estado, estado.indice - 1, relogio);
}

/** Índice da próxima sem resposta, dando a volta; null se não há nenhuma. */
export function proximaEmBranco(estado: RodadaEstado): number | null {
  const total = estado.questoes.length;
  for (let passo = 1; passo <= total; passo++) {
    const i = (estado.indice + passo) % total;
    if (estado.respostas[i] === null) return i;
  }
  return null;
}

/** Posições 1-based das questões sem resposta, em ordem. */
export function emBranco(estado: RodadaEstado): number[] {
  const posicoes: number[] = [];
  estado.respostas.forEach((r, i) => {
    if (r === null) posicoes.push(i + 1);
  });
  return posicoes;
}

/** Grava (ou sobrescreve) a resposta da questão atual e avança. No-op se a
 * rodada já encerrou ou se o cronômetro nunca foi iniciado.
 *
 * O guard é `inicioEm === null` (nunca `marcaEm`, de propósito): `inicioEm`
 * é o sinal verdadeiro de "iniciar() nunca foi chamado". `marcaEm` pode ser
 * `null` mesmo numa rodada perfeitamente iniciada e em andamento — é o caso
 * de uma rodada reconstruída do banco entre requisições HTTP, onde não há
 * cronômetro "vivo" em processo (ver `repositorioRodadas.carregarRodada`).
 * Usar `marcaEm` aqui faria a API de responder nunca gravar nada.
 */
export function responder(estado: RodadaEstado, letra: Letra, relogio: Relogio): RodadaEstado {
  if (encerrada(estado, relogio) || estado.inicioEm === null) return estado;
  const respostas = [...estado.respostas];
  respostas[estado.indice] = letra;
  return avancar({ ...estado, respostas }, relogio);
}

/** True quando não resta questão em branco. */
export function tudoRespondido(estado: RodadaEstado): boolean {
  return estado.questoes.length > 0 && estado.respostas.every((r) => r !== null);
}

/** Fim explícito da rodada: registra o tempo da questão atual e congela o
 * cronômetro. Idempotente — chamar de novo não altera `decorrido` nem
 * `esgotouTempo` na segunda vez em diante. */
export function encerrar(estado: RodadaEstado, relogio: Relogio): RodadaEstado {
  if (estado.fimEm !== null) return estado;
  const esgotouTempo = esgotado(estado, relogio);
  const comTempoFechado = registrarTempo(estado, relogio);
  return { ...comTempoFechado, esgotouTempo, fimEm: relogio() };
}

/** Acertos e erros, com o denominador dos dois modos. */
export function placar(estado: RodadaEstado, relogio: Relogio): Placar {
  const total = estado.questoes.length;
  const respondidas = estado.respostas.filter((r) => r !== null).length;
  const acertos = estado.questoes.reduce(
    (acc, q, i) => acc + (estado.respostas[i] === q.correta ? 1 : 0),
    0,
  );
  const erros = respondidas - acertos;

  return {
    total,
    respondidas,
    emBranco: total - respondidas,
    acertos,
    erros,
    percentual: respondidas > 0 ? (acertos / respondidas) * 100 : null,
    percentualTotal: total > 0 ? (acertos / total) * 100 : null,
    tempoTotal: decorrido(estado, relogio),
  };
}

/** Parâmetros para reconstruir uma rodada já finalizada, lida do histórico. */
export interface RestaurarFinalizadaParams {
  questoes: Questao[];
  respostas: (Letra | null)[];
  tempos: number[];
  decorrido: number;
  modo: Modo;
  limiteSegundos: number | null;
  esgotouTempo: boolean;
}

/** Reconstrói uma rodada já encerrada (lida do histórico), na ordem
 * gravada — sem embaralhar, sem depender do relógio.
 *
 * Truque igual ao `Sessao.restaurar` do Python: com `inicioEm=0` e
 * `fimEm=decorrido`, `decorrido()` devolve exatamente o valor gravado e
 * nunca consulta o relógio de novo.
 */
export function restaurarFinalizada(params: RestaurarFinalizadaParams): RodadaEstado {
  return {
    questoes: params.questoes,
    respostas: [...params.respostas],
    tempos: [...params.tempos],
    indice: 0,
    modo: params.modo,
    limiteSegundos: params.limiteSegundos,
    esgotouTempo: params.esgotouTempo,
    inicioEm: 0,
    marcaEm: null,
    fimEm: params.decorrido,
  };
}
