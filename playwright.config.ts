import { defineConfig } from "@playwright/test";

/** Config do E2E (Tarefa 22 — testes de fluxo das telas).
 *
 * Roda contra o servidor de PRODUÇÃO (`yarn build && yarn start`), não o
 * dev server: o dev server usa um banco separado por padrão de qualquer
 * forma, mas principalmente porque Turbopack em modo dev mantém uma
 * conexão de WebSocket (HMR) sempre aberta, o que tende a deixar
 * comandos como `waitForLoadState("networkidle")` presos para sempre.
 *
 * Usa o mesmo Postgres local dos testes unitários (`DATABASE_URL` — ver
 * `vitest.config.mts` e README, seção "Desenvolvimento local"). Não há mais
 * arquivo de banco a apagar entre execuções: cada teste cadastra sua
 * própria conta com email descartável (ver `e2e/fluxo-completo.spec.ts`),
 * então dados de execuções anteriores nunca aparecem no histórico de uma
 * conta nova.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "yarn start",
    port: 3000,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ?? "postgres://postgres:simulador@localhost:5433/simulador",
      SESSION_SECRET: process.env.SESSION_SECRET ?? "segredo-de-teste-nao-usar-em-producao",
    },
  },
});
