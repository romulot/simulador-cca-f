import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Espelha o "paths": { "@/*": ["./src/*"] } de tsconfig.json. Até agora
    // todo import entre módulos era `import type` (apagado em tempo de
    // build, nunca resolvido em runtime) — por isso essa lacuna não tinha
    // aparecido: o primeiro import de VALOR entre módulos via alias `@/`
    // (repositorioRodadas.ts -> domain/rodada.ts) quebrava sem isto.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Vários testes precisam criar fixtures DENTRO de `content/simulados/`
    // (não em tmpdir do SO) porque `parser.ts::validarDentroDoConteudo`
    // rejeita, de propósito, qualquer caminho fora dali (é a correção do
    // CRITICAL de path traversal da Tarefa 3). Isso significa que
    // `catalogo/index.test.ts` (varredura recursiva completa de
    // content/simulados/) e `parser.test.ts` (cria/remove sua própria
    // fixture na mesma árvore) compartilham o mesmo sistema de arquivos
    // real — com arquivos de teste rodando em paralelo (padrão do
    // Vitest), a varredura de um pode pegar a fixture do outro pela
    // metade. `fileParallelism: false` roda os arquivos em sequência,
    // eliminando a corrida sem precisar mudar nenhum comportamento de
    // produção.
    fileParallelism: false,
  },
});
