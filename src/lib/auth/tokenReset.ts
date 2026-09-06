import { createHash, randomBytes } from "node:crypto";

export const DURACAO_TOKEN_RESET_MS = 30 * 60 * 1000;

export function gerarTokenReset(): string {
  return randomBytes(32).toString("base64url");
}

export function hashTokenReset(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
