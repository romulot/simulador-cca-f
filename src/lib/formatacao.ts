/** Formatação compartilhada entre as telas — um lugar só, pra "12:05"
 * e "72%" sempre significarem a mesma coisa em qualquer tela. */

export function mmss(segundos: number): string {
  const s = Math.max(0, Math.round(segundos));
  const m = Math.floor(s / 60);
  const resto = s % 60;
  return `${String(m).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

export function formatarPercentual(fracao: number | null): string {
  if (fracao === null) return "—";
  return `${Math.round(fracao)}%`;
}

export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}
