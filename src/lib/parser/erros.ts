/** Erro de formato do markdown de simulados/gabaritos.
 *
 * Equivalente a `FormatoInvalido` do parser Python original
 * (`simulador/simulador/parser.py`).
 */
export class FormatoInvalido extends Error {
  readonly arquivo: string;
  readonly questao: number | null;
  readonly motivo: string;

  constructor(arquivo: string, questao: number | null, motivo: string) {
    const onde = questao === null ? arquivo : `${arquivo} Q${questao}`;
    super(`${onde}: ${motivo}`);
    this.name = "FormatoInvalido";
    this.arquivo = arquivo;
    this.questao = questao;
    this.motivo = motivo;
  }
}
