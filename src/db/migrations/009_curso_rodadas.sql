-- Curso da rodada: qual banco de conteúdo ela usa ("Curso Antigo" —
-- content/simulados/, 240 questões já tagueadas — ou "Exame Avançado" —
-- content/exame-avancado/, 300 questões). Default 'curso-antigo' preserva
-- rodadas históricas existentes sem exigir backfill manual. Não chamado
-- "trilha" no schema para bater com o identificador usado no código
-- (src/lib/catalogo/index.ts::CursoId) — ver comentário lá sobre a colisão
-- com src/components/Trilha.tsx.
ALTER TABLE rodadas
  ADD COLUMN IF NOT EXISTS curso TEXT NOT NULL DEFAULT 'curso-antigo'
  CHECK (curso IN ('curso-antigo', 'exame-avancado'));
