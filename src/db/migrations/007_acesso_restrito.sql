-- Fecha o acesso a contas previamente autorizadas. No momento desta
-- migration, a limpeza administrativa já preservou somente os dois usuários
-- oficiais; eles são ativados e qualquer conta inserida no futuro nasce sem
-- permissão até autorização administrativa explícita.
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS acesso_ativo BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE usuarios SET acesso_ativo = TRUE;
