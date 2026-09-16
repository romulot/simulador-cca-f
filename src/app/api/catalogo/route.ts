/** `GET /api/catalogo` — pares descobertos, agrupados por domínio.
 *
 * Ponte entre `src/lib/catalogo` (que só roda no servidor — acessa o
 * filesystem) e as telas de menu/seleção, que rodam no navegador. Devolve
 * só o resumo (contagens, validade) — nunca o texto das questões, que só é
 * exposto quando uma rodada de fato começa.
 */
import { NextResponse } from "next/server";

import { agrupar, cursoIdValido, descobrir, raizDoCurso, type CursoId } from "@/lib/catalogo";

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

export async function GET(request: Request): Promise<Response> {
  const cursoParam = new URL(request.url).searchParams.get("curso");
  if (cursoParam !== null && !cursoIdValido(cursoParam)) {
    return NextResponse.json({ erro: "'curso' deve ser 'curso-antigo' ou 'exame-avancado'" }, { status: 400 });
  }
  const curso: CursoId = cursoParam ?? "curso-antigo";

  const pares = descobrir(raizDoCurso(curso));

  // Trilha "Exame Avançado" nunca revela domínio ao candidato (ver Tarefa 8
  // do plano): os 5 pares desse curso são 1:1 com um domínio (mesmo nome de
  // diretório `dominio-N` do "Curso Antigo") — expor qualquer rótulo por
  // par (mesmo "Bloco N") entregaria essa correspondência de volta. Por
  // isso a resposta os funde num único item agregado, sem por-par nem
  // por-domínio.
  const grupos: GrupoResumo[] =
    curso === "exame-avancado"
      ? [
          {
            grupo: "Exame Avançado",
            pares: [
              {
                nome: "exame-avancado",
                rotulo: "Exame Avançado — todas as questões",
                totalQuestoes: pares.reduce((acc, p) => acc + p.questoes.length, 0),
                erro: pares.some((p) => p.erro !== null) ? "parte do conteúdo está indisponível" : null,
              },
            ],
          },
        ]
      : agrupar(pares).map(([grupo, ps]) => ({
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
