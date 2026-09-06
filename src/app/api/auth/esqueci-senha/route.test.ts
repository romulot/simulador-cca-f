import { beforeEach, describe, expect, it, vi } from "vitest";

import { obterConexao } from "@/db/conexao";
import { criarUsuario } from "@/db/repositorioUsuarios";
import { limparRateLimitParaTeste } from "@/lib/auth/rateLimit";
import { hashSenha } from "@/lib/auth/senha";
import { enviarResetSenha } from "@/lib/email/enviarResetSenha";

vi.mock("@/lib/email/enviarResetSenha", () => ({ enviarResetSenha: vi.fn().mockResolvedValue(undefined) }));

function post(email: string): Request {
  return new Request("http://localhost/api/auth/esqueci-senha", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }),
  });
}

describe("POST /api/auth/esqueci-senha", () => {
  beforeEach(() => {
    limparRateLimitParaTeste();
    vi.mocked(enviarResetSenha).mockClear();
    process.env.APP_URL = "https://simulador.exemplo";
  });

  it("devolve a mesma mensagem para e-mail existente e inexistente", async () => {
    const email = `recuperar-${Date.now()}-${Math.random()}@exemplo.invalido`;
    await criarUsuario(await obterConexao(), email, await hashSenha("senha-antiga"));
    const { POST } = await import("./route");
    const existente = await POST(post(email));
    const inexistente = await POST(post(`ausente-${Date.now()}@exemplo.invalido`));
    expect(existente.status).toBe(200);
    expect(inexistente.status).toBe(200);
    expect((await existente.json()).mensagem).toBe((await inexistente.json()).mensagem);
    expect(enviarResetSenha).toHaveBeenCalledTimes(1);
    expect(vi.mocked(enviarResetSenha).mock.calls[0][0].link).not.toContain(email);
  });

  it("rejeita e-mail inválido", async () => {
    const { POST } = await import("./route");
    expect((await POST(post("invalido"))).status).toBe(400);
  });
});
