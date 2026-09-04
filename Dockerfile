# syntax=docker/dockerfile:1

# Build multi-stage: "deps" resolve as dependencias (o unico estagio que
# baixa/instala pacotes), "build" compila o Next.js, "runtime" e a imagem
# final -- enxuta, sem ferramenta de build, sem devDependencies do E2E
# (Playwright), com apenas o necessario pra rodar `next start`.
#
# `better-sqlite3` traz binarios nativos PRE-COMPILADOS para linux-x64 e
# linuxmusl-x64 dentro do proprio pacote (node_modules/better-sqlite3/
# prebuilds/) -- por isso nao ha estagio de compilacao nativa aqui: nao
# precisa de gcc/python3/make, só copiar node_modules já resolvido.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN corepack enable && yarn install --immutable

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY . .
RUN corepack enable && yarn build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Caminho do banco DENTRO do volume nomeado declarado no compose (ver
# docker-compose.yml) -- sobrevive a `docker compose down`/`up`.
ENV SIMULADOR_DB_PATH=/app/data/simulador.db

# Usuário não-root: o processo Next.js não precisa de privilégio nenhum
# além de ler o próprio código e escrever no diretório do volume.
RUN addgroup -S simulador && adduser -S simulador -G simulador

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
# Lidos via `fs` em tempo de execução (não fazem parte do bundle do
# Next.js) — precisam existir no mesmo caminho relativo ao cwd que o
# código já assume (ver comentários em src/db/migrate.ts e
# src/lib/parser/parser.ts).
COPY --from=build /app/src/db/schema.sql ./src/db/schema.sql
COPY --from=build /app/content ./content

RUN mkdir -p /app/data && chown -R simulador:simulador /app/data
USER simulador

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
