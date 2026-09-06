import { beforeEach, describe, expect, it } from "vitest";

import { NOME_COOKIE_SESSAO } from "@/lib/auth/sessao";
import { limparRateLimitParaTeste } from "@/lib/auth/rateLimit";

beforeEach(limparRateLimitParaTeste);

function post(corpo: unknown): Request {
  return new Request("http://localhost/api/auth/registro", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

function emailUnico(): string {
  return `registro-${process.pid}-${Date.now()}-${Math.random()}@exemplo.invalido`;
}

describe("POST /api/auth/registro", () => {
  it("cadastro válido cria a conta, autentica (cookie de sessão) e devolve 201", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(post({ email: emailUnico(), senha: "senha-forte-123" }));

    expect(resposta.status).toBe(201);
    const corpo = await resposta.json();
    expect(typeof corpo.id).toBe("number");
    expect(corpo.email).toMatch(/@exemplo\.invalido$/);
    expect(resposta.cookies.get(NOME_COOKIE_SESSAO)?.value).toBeTruthy();
  });

  it("email já cadastrado devolve 409, sem criar segunda conta", async () => {
    const { POST } = await import("./route");
    const email = emailUnico();
    const primeira = await POST(post({ email, senha: "senha-forte-123" }));
    expect(primeira.status).toBe(201);

    const segunda = await POST(post({ email, senha: "outra-senha-456" }));
    expect(segunda.status).toBe(409);
  });

  it("email inválido devolve 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(post({ email: "nao-e-email", senha: "senha-forte-123" }));
    expect(resposta.status).toBe(400);
  });

  it("senha curta (menos de 8 caracteres) devolve 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(post({ email: emailUnico(), senha: "curta" }));
    expect(resposta.status).toBe(400);
  });

  it("corpo que não é JSON válido devolve 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(
      new Request("http://localhost/api/auth/registro", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{ nao e json",
      }),
    );
    expect(resposta.status).toBe(400);
  });
});
