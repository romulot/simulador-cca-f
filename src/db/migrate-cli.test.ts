import type { Pool } from "pg";
import { describe, expect, it, vi } from "vitest";

import { executarMigrationsAdministrativas } from "./migrate-cli.mts";

function criarDependencias() {
  const pool = { end: vi.fn().mockResolvedValue(undefined) } as unknown as Pool;
  return {
    pool,
    criarPool: vi.fn(() => pool),
    migrar: vi.fn().mockResolvedValue(undefined),
  };
}

describe("comando administrativo de migrations", () => {
  it("exige MIGRATION_DATABASE_URL sem recorrer a DATABASE_URL", async () => {
    const dependencias = criarDependencias();

    await expect(
      executarMigrationsAdministrativas(
        { DATABASE_URL: "postgres://runtime-nao-deve-ser-usado" },
        dependencias,
      ),
    ).rejects.toThrow("MIGRATION_DATABASE_URL não configurada");

    expect(dependencias.criarPool).not.toHaveBeenCalled();
    expect(dependencias.migrar).not.toHaveBeenCalled();
  });

  it("usa a URL administrativa, executa o migrador e fecha o pool", async () => {
    const dependencias = criarDependencias();
    const migrationUrl = "postgres://administracao:segredo@localhost:5432/simulador";

    await executarMigrationsAdministrativas(
      {
        DATABASE_URL: "postgres://runtime@localhost:6543/simulador",
        MIGRATION_DATABASE_URL: migrationUrl,
      },
      dependencias,
    );

    expect(dependencias.criarPool).toHaveBeenCalledWith(migrationUrl);
    expect(dependencias.migrar).toHaveBeenCalledWith(dependencias.pool);
    expect(dependencias.pool.end).toHaveBeenCalledOnce();
  });

  it("fecha o pool mesmo quando a migration falha", async () => {
    const dependencias = criarDependencias();
    dependencias.migrar.mockRejectedValueOnce(new Error("migration inválida"));

    await expect(
      executarMigrationsAdministrativas(
        { MIGRATION_DATABASE_URL: "postgres://administracao@localhost:5432/simulador" },
        dependencias,
      ),
    ).rejects.toThrow("migration inválida");

    expect(dependencias.pool.end).toHaveBeenCalledOnce();
  });
});
