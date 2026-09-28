-- O texto do caso acompanha o snapshot de cada questão para que revisões
-- antigas continuem fiéis mesmo após edições no conteúdo-fonte.
ALTER TABLE questoes_rodada ADD COLUMN IF NOT EXISTS caso_base TEXT;
