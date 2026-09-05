import { describe, expect, it } from "vitest";

import { NOME_COOKIE_SESSAO } from "@/lib/auth/sessao";

function post(url: string, corpo: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

function emailUnico(): string {
  return `login-${process.pid}-${Date.now()}-${Math.random()}@exemplo.invalido`;
}

async function registrar(email: string, senha: string) {
  const { POST } = await import("../registro/route");
  const resposta = await POST(post("http://localhost/api/auth/registro", { email, senha }));
  expect(resposta.status).toBe(201);
}

describe("POST /api/auth/login", () => {
  it("credenciais corretas autenticam (cookie de sessão) e devolvem 200", async () => {
    const email = emailUnico();
    await registrar(email, "senha-correta-123");

    const { POST } = await import("./route");
    const resposta = await POST(post("http://localhost/api/auth/login", { email, senha: "senha-correta-123" }));

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.email).toBe(email.toLowerCase());
    expect(resposta.cookies.get(NOME_COOKIE_SESSAO)?.value).toBeTruthy();
  });

  it("email inexistente e senha errada devolvem a MESMA mensagem (401)", async () => {
    const email = emailUnico();
    await registrar(email, "senha-correta-123");

    const { POST } = await import("./route");

    const semConta = await POST(
      post("http://localhost/api/auth/login", { email: emailUnico(), senha: "qualquer-coisa" }),
    );
    const senhaErrada = await POST(
      post("http://localhost/api/auth/login", { email, senha: "senha-errada-000" }),
    );

    expect(semConta.status).toBe(401);
    expect(senhaErrada.status).toBe(401);
    const corpoSemConta = await semConta.json();
    const corpoSenhaErrada = await senhaErrada.json();
    expect(corpoSemConta.erro).toBe(corpoSenhaErrada.erro);
  });

  it("corpo sem email/senha devolve 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(post("http://localhost/api/auth/login", {}));
    expect(resposta.status).toBe(400);
  });
});
