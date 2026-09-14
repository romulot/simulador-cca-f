-- Arquétipo de distrator por alternativa errada, capturado do gabarito
-- (bloco de metadados) e persistido junto ao snapshot da questão — mesmo
-- padrão de 003_topicos_questoes_rodada.sql. Mapa JSON {"A": "id-do-arquetipo",
-- ...}, nunca incluindo a letra correta; '{}' quando o gabarito ainda não
-- foi tagueado (campo opcional no parser, ver src/lib/parser/parser.ts).
ALTER TABLE questoes_rodada
  ADD COLUMN IF NOT EXISTS arquetipos_json TEXT NOT NULL DEFAULT '{}';
