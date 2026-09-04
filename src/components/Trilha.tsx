/** Trilha de progresso: uma célula por questão.
 *
 * O elemento-assinatura do app (ver `globals.css`) — nunca comunica estado
 * só por cor: cada célula também difere de contorno/preenchimento, e o
 * texto alternativo do componente descreve o total de respondidas/em
 * branco por extenso, pra quem usa leitor de tela.
 */
export type EstadoCelula = "em_branco" | "respondida" | "atual" | "acerto" | "erro";

export interface TrilhaProps {
  /** Um estado por questão, na ordem da rodada. */
  celulas: EstadoCelula[];
  className?: string;
}

export function Trilha({ celulas, className }: TrilhaProps) {
  const respondidas = celulas.filter((c) => c !== "em_branco").length;
  const descricao = `Progresso: ${respondidas} de ${celulas.length} questões respondidas.`;

  return (
    <div
      className={["trilha", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={descricao}
    >
      {celulas.map((estado, i) => (
        <span key={i} className="trilha-celula" data-estado={estado} aria-hidden="true" />
      ))}
    </div>
  );
}

/** Deriva os estados da trilha a partir de `respostas`/`indiceAtual` —
 * ponto único de tradução para não haver duas lógicas de "o que é atual,
 * o que está em branco" divergindo entre telas. */
export function celulasDeRespostas(
  respostas: Array<string | null>,
  indiceAtual: number | null,
): EstadoCelula[] {
  return respostas.map((r, i) => {
    if (i === indiceAtual) return "atual";
    return r === null ? "em_branco" : "respondida";
  });
}
