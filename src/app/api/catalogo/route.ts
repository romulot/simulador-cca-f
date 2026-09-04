/** `GET /api/catalogo` — pares descobertos, agrupados por domínio.
 *
 * Ponte entre `src/lib/catalogo` (que só roda no servidor — acessa o
 * filesystem) e as telas de menu/seleção, que rodam no navegador. Devolve
 * só o resumo (contagens, validade) — nunca o texto das questões, que só é
 * exposto quando uma rodada de fato começa.
 */
import { NextResponse } from "next/server";

import { agrupar, descobrir } from "@/lib/catalogo";

export interface ParResumo {
  nome: string;
  rotulo: string;
  totalQuestoes: number;
  erro: string | null;
}

export interface GrupoResumo {
  grupo: string;
  pares: ParResumo[];
}

export interface RespostaCatalogo {
  grupos: GrupoResumo[];
  totais: {
    pares: number;
    paresValidos: number;
    questoes: number;
  };
}

export async function GET(): Promise<Response> {
  const pares = descobrir();
  const grupos: GrupoResumo[] = agrupar(pares).map(([grupo, ps]) => ({
    grupo,
    pares: ps.map((p) => ({
      nome: p.nome,
      rotulo: p.rotulo,
      totalQuestoes: p.questoes.length,
      erro: p.erro,
    })),
  }));

  const validas = pares.filter((p) => p.erro === null);
  const resposta: RespostaCatalogo = {
    grupos,
    totais: {
      pares: pares.length,
      paresValidos: validas.length,
      questoes: validas.reduce((acc, p) => acc + p.questoes.length, 0),
    },
  };

  return NextResponse.json(resposta);
}
