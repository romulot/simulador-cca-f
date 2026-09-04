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
  },
});
