export interface Curadoria {
  n: number;
  /** Só para validação cruzada com o header já convertido pela Tarefa 5 —
   * não é escrito de novo no arquivo. */
  correta: "A" | "B" | "C" | "D";
  resumo: string;
  bloom: "Lembrar" | "Aplicar" | "Analisar" | "Avaliar";
  dificuldade: "Fácil" | "Médio" | "Difícil";
  cenario: string;
  principio: string;
  topicos: string[];
  /** Só as alternativas ERRADAS podem aparecer; nunca a de `correta`. */
  arquetipos: Partial<Record<"A" | "B" | "C" | "D", string>>;
}
