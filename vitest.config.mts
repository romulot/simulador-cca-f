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
    globalSetup: "./src/db/testGlobalSetup.ts",
    environment: "node",
    // Testes de repositório/rotas precisam de um Postgres real (ver
    // src/db/apoioTeste.ts) — default para o Postgres local de
    // desenvolvimento (README, seção "Desenvolvimento local"). Sobrescreva
    // exportando as variáveis antes de `yarn test` se seu Postgres de teste
    // estiver em outro lugar.
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:simulador@localhost:5433/simulador",
      SESSION_SECRET: process.env.SESSION_SECRET ?? "segredo-de-teste-nao-usar-em-producao",
    },
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
    // e2e/ é Playwright (yarn test:e2e), não Vitest — sem isto, o glob
    // padrão de "*.spec.ts" do Vitest tentava rodar os specs do Playwright
    // também, e `test()` do Playwright não é compatível com o runner do
    // Vitest.
    exclude: ["**/node_modules/**", "e2e/**"],
  },
});
