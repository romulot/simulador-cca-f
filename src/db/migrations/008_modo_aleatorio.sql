-- Modo avaliativo sem pesos e sem limite de tempo. A constraint original
-- foi criada sem nome explícito pelo Postgres em 001_initial.sql.
ALTER TABLE rodadas DROP CONSTRAINT IF EXISTS rodadas_modo_check;
ALTER TABLE rodadas
  ADD CONSTRAINT rodadas_modo_check
  CHECK (modo IN ('pratica', 'aleatorio', 'prova'));
