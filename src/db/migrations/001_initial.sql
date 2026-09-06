CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rodadas (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  modo TEXT NOT NULL CHECK (modo IN ('pratica', 'prova')),
  iniciada_em TEXT NOT NULL,
  limite_segundos INTEGER,
  decorrido_segundos DOUBLE PRECISION,
  esgotou_tempo BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('em_andamento', 'finalizada')),
  indice_atual INTEGER NOT NULL DEFAULT 0,
  cotas_json TEXT,
  disponivel_json TEXT,
  deficit_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_rodadas_user_id ON rodadas (user_id);

CREATE TABLE IF NOT EXISTS questoes_rodada (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rodada_id INTEGER NOT NULL REFERENCES rodadas (id) ON DELETE CASCADE,
  posicao INTEGER NOT NULL,
  origem TEXT NOT NULL,
  dominio INTEGER,
  numero INTEGER NOT NULL,
  enunciado TEXT NOT NULL,
  alternativas_json TEXT NOT NULL,
  correta TEXT NOT NULL CHECK (correta IN ('A', 'B', 'C', 'D')),
  resumo TEXT NOT NULL,
  explicacoes_json TEXT NOT NULL,
  bloom TEXT NOT NULL,
  dificuldade TEXT NOT NULL,
  rubrica TEXT NOT NULL,
  cenario TEXT NOT NULL,
  principio_testado TEXT NOT NULL,
  resposta TEXT CHECK (resposta IN ('A', 'B', 'C', 'D')),
  segundos DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_questoes_rodada_rodada_posicao
  ON questoes_rodada (rodada_id, posicao);
