#!/usr/bin/env python3
"""Embaralha a posicao da alternativa correta nos simulados do exame-avancado.

As questoes sao escritas com a correta sempre em A (mais facil de revisar) e
este script redistribui as letras, mantendo simulado e gabarito em sincronia.

- Deterministico: a mesma semente sempre produz o mesmo embaralhamento.
- Balanceado: exatamente 15 corretas em cada letra por bloco de 60.
- Idempotente por semente: rodar de novo com a mesma semente reescreve igual
  SOMENTE se partir dos arquivos originais; por isso grava um .lock com o
  hash do resultado e recusa embaralhar duas vezes o mesmo arquivo.
"""
import hashlib
import json
import random
import re
import sys
from pathlib import Path

LETTERS = "ABCD"
OPT_SIM = re.compile(r"^- \*\*([A-D])\)\*\* (.*)$")
OPT_GAB = re.compile(r"^- \*\*([A-D])\) (✅|❌)\*\* (.*)$")
HEAD_SIM = re.compile(r"^### Q(\d+)\s*$")
HEAD_GAB = re.compile(r"^### Q(\d+) — Resposta: \*\*([A-D])\*\*\s*$")


def blocos(linhas, regex_opt):
    """Devolve lista de (inicio, fim) das corridas de 4 alternativas."""
    out, i = [], 0
    while i < len(linhas):
        if regex_opt.match(linhas[i]):
            j = i
            while j < len(linhas) and regex_opt.match(linhas[j]):
                j += 1
            if j - i != 4:
                raise SystemExit(f"bloco com {j-i} alternativas na linha {i+1}")
            out.append((i, j))
            i = j
        else:
            i += 1
    return out


def permutacoes(n, semente):
    """n permutacoes, com a correta (indice 0) caindo 1/4 das vezes em cada letra."""
    rng = random.Random(semente)
    alvos = [p for p in range(4) for _ in range(n // 4)]
    alvos += [rng.randrange(4) for _ in range(n % 4)]
    rng.shuffle(alvos)
    perms = []
    for alvo in alvos:
        outros = [1, 2, 3]
        rng.shuffle(outros)
        p = [None] * 4
        p[alvo] = 0                       # a correta
        for pos in (x for x in range(4) if x != alvo):
            p[pos] = outros.pop()
        perms.append(p)
    return perms


def processar(dominio, semente):
    base = Path(__file__).parent
    sim_p = base / f"dominio-{dominio}_simulado.md"
    gab_p = base / f"dominio-{dominio}_gabarito.md"
    lock_p = base / f".dominio-{dominio}.lock"
    if lock_p.exists():
        raise SystemExit(f"dominio {dominio} ja embaralhado ({lock_p.name}) — apague o lock para refazer")

    sim = sim_p.read_text(encoding="utf-8").split("\n")
    gab = gab_p.read_text(encoding="utf-8").split("\n")
    b_sim, b_gab = blocos(sim, OPT_SIM), blocos(gab, OPT_GAB)
    if len(b_sim) != len(b_gab):
        raise SystemExit(f"simulado tem {len(b_sim)} questoes e gabarito {len(b_gab)}")

    perms = permutacoes(len(b_sim), f"{semente}-d{dominio}")

    for (ini, fim), perm in zip(reversed(b_sim), reversed(perms)):
        textos = [OPT_SIM.match(l).group(2) for l in sim[ini:fim]]
        sim[ini:fim] = [f"- **{LETTERS[j]})** {textos[perm[j]]}" for j in range(4)]

    for (ini, fim), perm in zip(reversed(b_gab), reversed(perms)):
        corpo = [OPT_GAB.match(l).groups()[1:] for l in gab[ini:fim]]  # (marca, texto)
        gab[ini:fim] = [
            f"- **{LETTERS[j]}) {corpo[perm[j]][0]}** {corpo[perm[j]][1]}" for j in range(4)
        ]
        nova = LETTERS[perm.index(0)]
        k = ini - 1
        while k >= 0 and not HEAD_GAB.match(gab[k]):
            k -= 1
        if k < 0:
            raise SystemExit(f"cabecalho de resposta nao encontrado antes da linha {ini+1}")
        gab[k] = HEAD_GAB.sub(lambda m: f"### Q{m.group(1)} — Resposta: **{nova}**", gab[k])

    sim_p.write_text("\n".join(sim), encoding="utf-8")
    gab_p.write_text("\n".join(gab), encoding="utf-8")

    dist = {}
    for l in gab:
        m = HEAD_GAB.match(l)
        if m:
            dist[m.group(2)] = dist.get(m.group(2), 0) + 1
    lock_p.write_text(json.dumps({
        "semente": semente,
        "questoes": len(b_sim),
        "distribuicao": dist,
        "sha_simulado": hashlib.sha256(sim_p.read_bytes()).hexdigest()[:16],
        "sha_gabarito": hashlib.sha256(gab_p.read_bytes()).hexdigest()[:16],
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return len(b_sim), dist


if __name__ == "__main__":
    semente = "ccaf-exame-avancado-2026"
    alvos = sys.argv[1:] or ["1", "2", "3", "4", "5"]
    for d in alvos:
        if not (Path(__file__).parent / f"dominio-{d}_simulado.md").exists():
            print(f"dominio {d}: ainda nao gerado, pulando")
            continue
        n, dist = processar(d, semente)
        print(f"dominio {d}: {n} questoes · distribuicao {dict(sorted(dist.items()))}")
