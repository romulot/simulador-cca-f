interface Entrada {
  inicio: number;
  tentativas: number;
}

const tentativas = new Map<string, Entrada>();

export function identificarCliente(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? request.headers.get("x-real-ip")
    ?? "desconhecido";
}

export function excedeuLimite(chave: string, limite: number, janelaMs = 15 * 60 * 1000): boolean {
  const agora = Date.now();
  const atual = tentativas.get(chave);
  if (!atual || agora - atual.inicio >= janelaMs) {
    tentativas.set(chave, { inicio: agora, tentativas: 1 });
    return false;
  }
  atual.tentativas += 1;
  return atual.tentativas > limite;
}

export function limparRateLimitParaTeste(): void {
  tentativas.clear();
}
