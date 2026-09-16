/** Identificador de curso: vocabulário puro, sem acesso a filesystem — por
 * isso vive num módulo separado de `index.ts` (que importa `node:fs`) e pode
 * ser importado por componentes cliente sem puxar esse módulo inteiro para
 * o bundle do navegador. `@/lib/catalogo` (index.ts) reexporta tudo daqui
 * para o código de servidor continuar importando de um só lugar.
 *
 * Cada curso tem sua própria raiz de conteúdo em disco (`raizDoCurso`,
 * em `index.ts` — essa função *precisa* de `node:fs`/`node:path`, por isso
 * fica lá, não aqui) e persiste como coluna `curso` em `rodadas`
 * (`src/db/repositorioRodadas.ts`). Não chamado "trilha" no código para não
 * colidir com `src/components/Trilha.tsx` (barra de progresso de questão,
 * conceito não relacionado) — os rótulos de UI ("Curso Antigo" / "Exame
 * Avançado") não têm esse problema.
 */
export const CURSOS = ["curso-antigo", "exame-avancado"] as const;
export type CursoId = (typeof CURSOS)[number];

export function cursoIdValido(valor: string): valor is CursoId {
  return (CURSOS as readonly string[]).includes(valor);
}
