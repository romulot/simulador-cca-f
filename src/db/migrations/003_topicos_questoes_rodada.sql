ALTER TABLE questoes_rodada
  ADD COLUMN IF NOT EXISTS topicos_json TEXT NOT NULL DEFAULT '[]';
