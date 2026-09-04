import { defineConfig } from "@playwright/test";

/** Config do E2E (Tarefa 22 — testes de fluxo das telas).
 *
 * Roda contra o servidor de PRODUÇÃO (`yarn build && yarn start`), não o
 * dev server: o dev server usa um banco separado por padrão de qualquer
 * forma, mas principalmente porque Turbopack em modo dev mantém uma
 * conexão de WebSocket (HMR) sempre aberta, o que tende a deixar
 * comandos como `waitForLoadState("networkidle")` presos para sempre.
 *
 * Isolado do banco de desenvolvimento via `SIMULADOR_DB_PATH` apontando
 * para um arquivo dedicado ao E2E (apagado antes de cada execução pelo
 * script `test:e2e`, ver package.json).
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
      SIMULADOR_DB_PATH: "./data/e2e-test.db",
    },
  },
});
