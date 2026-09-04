/** Barra proporcional — mesmo grão visual da `Trilha`, em outra escala:
 * usada no desempenho por domínio (acertos/total). Nunca é o único sinal
 * do número: o rótulo textual ao lado sempre traz "acertos/total (pct%)". */
export interface BarraProps {
  /** 0 a 1. */
  fracao: number;
  className?: string;
}

export function Barra({ fracao, className }: BarraProps) {
  const pct = Math.round(Math.min(Math.max(fracao, 0), 1) * 100);
  return (
    <div className={["barra-trilho", className].filter(Boolean).join(" ")}>
      <div className="barra-preenchimento" style={{ width: `${pct}%` }} />
    </div>
  );
}
