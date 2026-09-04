-- Schema do banco de persistência de rodadas (prática/prova).
--
-- Cada rodada guarda um snapshot AUTO-CONTIDO de cada questão respondida
-- (texto completo, não só um ID): o markdown-fonte em `content/simulados/`
-- pode ser editado depois, e o histórico precisa continuar mostrando
-- exatamente o que o candidato leu naquela rodada. Ver
-- `simulador/simulador/historico.py::serializar` (Python) para a referência
-- original deste contrato.
--
-- Estatísticas (acertos, percentual) NÃO são persistidas: são recalculadas
-- na leitura a partir das respostas brutas em `questoes_rodada`, para nunca
-- haver duas fontes de verdade divergentes.
--
-- `esgotou_tempo` é um fato bruto da rodada (como ela terminou), não
-- inferido depois por comparação de `decorrido_segundos >= limite_segundos`.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS rodadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  modo TEXT NOT NULL CHECK (modo IN ('pratica', 'prova')),
  iniciada_em TEXT NOT NULL,
  limite_segundos INTEGER,
  -- REAL (não INTEGER): `decorrido()` no domínio (src/domain/rodada.ts) é a
  -- diferença entre dois timestamps de ponto flutuante: truncar pra inteiro
  -- aqui perderia precisão sem necessidade.
  decorrido_segundos REAL,
  esgotou_tempo INTEGER NOT NULL DEFAULT 0 CHECK (esgotou_tempo IN (0, 1)),
  status TEXT NOT NULL CHECK (status IN ('em_andamento', 'finalizada')),
  indice_atual INTEGER NOT NULL DEFAULT 0,
  cotas_json TEXT,
  disponivel_json TEXT,
  deficit_json TEXT
);

-- `posicao` é 0-based: mesmo índice usado para `sessao.questoes[i]` /
-- `sessao.respostas[i]` / `sessao.tempos[i]` no código Python de origem,
-- sem precisar de tradução +1/-1 ao ler ou escrever.
CREATE TABLE IF NOT EXISTS questoes_rodada (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  -- Metadados de revisão do gabarito (bloco "Metadados (revisão; não exibir
  -- ao candidato):"), ver `src/lib/parser/tipos.ts::MetadadosQuestao`.
  bloom TEXT NOT NULL,
  dificuldade TEXT NOT NULL,
  rubrica TEXT NOT NULL,
  cenario TEXT NOT NULL,
  principio_testado TEXT NOT NULL,
  resposta TEXT CHECK (resposta IN ('A', 'B', 'C', 'D')),
  -- REAL pelo mesmo motivo de `rodadas.decorrido_segundos` acima.
  segundos REAL NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_questoes_rodada_rodada_posicao
  ON questoes_rodada (rodada_id, posicao);
