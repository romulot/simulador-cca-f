import { beforeEach, describe, expect, it } from "vitest";

import { obterConexao } from "@/db/conexao";
import { criarTokenReset } from "@/db/repositorioResetSenha";
import { criarUsuario } from "@/db/repositorioUsuarios";
import { limparRateLimitParaTeste } from "@/lib/auth/rateLimit";
import { hashSenha, verificarSenha } from "@/lib/auth/senha";
import { hashTokenReset } from "@/lib/auth/tokenReset";

function post(corpo: unknown): Request {
  return new Request("http://localhost/api/auth/redefinir-senha", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo),
  });
}

describe("POST /api/auth/redefinir-senha", () => {
  beforeEach(limparRateLimitParaTeste);

  async function fixture(expiraEm: Date) {
    const pool = await obterConexao();
    const usuario = await criarUsuario(pool, `reset-${Date.now()}-${Math.random()}@exemplo.invalido`, await hashSenha("senha-antiga"));
    const token = `token-seguro-${Date.now()}-${Math.random()}-suficiente`;
    await criarTokenReset(pool, usuario.id, hashTokenReset(token), expiraEm);
    return { pool, usuario, token };
  }

  it("altera a senha com token válido e impede reutilização", async () => {
    const { pool, usuario, token } = await fixture(new Date(Date.now() + 60_000));
    const { POST } = await import("./route");
    expect((await POST(post({ token, senha: "nova-senha-segura" }))).status).toBe(200);
    const atualizado = await pool.query<{ senha_hash: string }>("SELECT senha_hash FROM usuarios WHERE id = $1", [usuario.id]);
    expect(await verificarSenha("nova-senha-segura", atualizado.rows[0].senha_hash)).toBe(true);
    expect((await POST(post({ token, senha: "outra-senha-segura" }))).status).toBe(400);
  });

  it("rejeita token inválido, expirado e senha curta", async () => {
    const { token } = await fixture(new Date(Date.now() - 60_000));
    const { POST } = await import("./route");
    expect((await POST(post({ token: "token-invalido-com-tamanho-suficiente", senha: "senha-segura" }))).status).toBe(400);
    expect((await POST(post({ token, senha: "senha-segura" }))).status).toBe(400);
    expect((await POST(post({ token, senha: "curta" }))).status).toBe(400);
  });
});
