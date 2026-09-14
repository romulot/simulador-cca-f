/** Taxonomia canônica dos arquétipos de distrator da CCA-F.
 *
 * Porte de `conhecimento/arquetipos-distrator.md` (no laboratório de
 * estudos `claude-cca-f-estudos`) para dado estático de domínio — mesmo
 * espírito de `domain/topicos.ts`: vocabulário do domínio de aprendizado,
 * reaproveitado por várias features (tag por alternativa no gabarito,
 * agregação "quais arquétipos mais confundem o candidato"), nunca acoplado
 * a uma tela específica.
 *
 * `id` é estável e curto (kebab-case) — é o valor gravado na linha
 * `Arquétipos:` do gabarito (ver `lib/parser/parser.ts`) e em
 * `questoes_rodada.arquetipos_json`. Nunca deriva de `nome` por slugify,
 * para não quebrar tag já gravada se o rótulo mudar de redação.
 */
export interface Arquetipo {
  id: string;
  nome: string;
  /** A pergunta de verificação que desarma o arquétipo — o "antídoto" do
   * documento de referência. */
  antidoto: string;
}

export const ARQUETIPOS: Arquetipo[] = [
  {
    id: "camada-alvo-errado",
    nome: "Camada / alvo errado",
    antidoto: "O que exatamente o enunciado mediu como ruim? A resposta certa move aquela métrica — se a alternativa melhora outra coisa, é distrator.",
  },
  {
    id: "montante-jusante",
    nome: "Montante × jusante",
    antidoto: "A informação existia antes? O que a destruiu? Conserte onde ela morre, não onde a falta dela aparece.",
  },
  {
    id: "probabilistico-vs-garantia",
    nome: "Probabilístico onde o requisito é garantia",
    antidoto: "O enunciado usa um verbo absoluto (never/must/ensure/always)? A resposta certa é um mecanismo determinístico (hook, gate, permissions.deny, escopo, teste) — nunca prosa.",
  },
  {
    id: "over-engineering",
    nome: "Over-engineering",
    antidoto: "Qual é a correção mais barata que satisfaz o requisito inteiro?",
  },
  {
    id: "extremo-vs-meio",
    nome: "Extremo em vez do meio calibrado",
    antidoto: "O enunciado nomeia dois valores em tensão? Os dois extremos são distratores por construção — a resposta é o meio proporcional.",
  },
  {
    id: "opiniao-de-personagem",
    nome: "Opinião de personagem lida como requisito",
    antidoto: "A frase é vinculante (requires/policy states) ou avaliável (objects/argues/believes)? Papel + verbo de opinião é premissa a testar, não a atender.",
  },
  {
    id: "vazio-ausente",
    nome: "Vazio × ausente",
    antidoto: "Vazio é resposta válida; ausente é falha. Um array presente e vazio satisfaz `required` — não confunda com o campo faltando.",
  },
  {
    id: "sinal-nao-confiavel",
    nome: "Sinal não-confiável",
    antidoto: "O sinal é confiança auto-relatada pelo modelo em prosa, sentimento ou tom? Não é critério de decisão — diferente de um score de confiança CALCULADO pelo pipeline, que pode ser o critério recomendado.",
  },
  {
    id: "enumerar-vs-generalizar",
    nome: "Enumerar em vez de generalizar",
    antidoto: "O enunciado descreve um fluxo de casos novos (não um caso faltando)? A resposta é estrutura aberta, não um enum que cresce a cada caso.",
  },
  {
    id: "feature-inexistente-verossimil",
    nome: "Feature inexistente porém verossímil",
    antidoto: "O nome da flag/parâmetro parece bom demais para o caso, hiper-específico? Desconfie — pode ser invenção; verifique contra a documentação oficial antes de aceitar.",
  },
];

const POR_ID = new Map(ARQUETIPOS.map((a) => [a.id, a]));

export function arquetipoPorId(id: string): Arquetipo | undefined {
  return POR_ID.get(id);
}

export function idArquetipoValido(id: string): boolean {
  return POR_ID.has(id);
}
