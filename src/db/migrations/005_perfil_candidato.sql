-- Perfil do candidato para o motor de recomendação adaptativa: data da
-- prova (usada para urgência/pacing) e minutos por sessão padrão (usados
-- como corte de tempo default quando a rota não recebe 'minutos' na
-- query). Ambos opcionais — nem todo candidato preenche antes de praticar.
-- TEXT em formato ISO 'YYYY-MM-DD' (não DATE nativo), mesmo padrão já usado
-- em rodadas.iniciada_em: evita a conversão de fuso horário que o driver pg
-- aplicaria a um tipo DATE/TIMESTAMPTZ.
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS data_prova TEXT,
  ADD COLUMN IF NOT EXISTS minutos_sessao_padrao INTEGER;
