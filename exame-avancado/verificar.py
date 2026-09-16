#!/usr/bin/env python3
"""Verifica a integridade do banco: contagem, formato e sincronia simulado<->gabarito."""
import re
import sys
from collections import Counter
from pathlib import Path

OPT_SIM = re.compile(r"^- \*\*([A-D])\)\*\* (.+)$")
OPT_GAB = re.compile(r"^- \*\*([A-D])\) (✅|❌)\*\* (.+)$")
HEAD_SIM = re.compile(r"^### Q(\d+)\s*$")
HEAD_GAB = re.compile(r"^### Q(\d+) — Resposta: \*\*([A-D])\*\*\s*$")
# referencia a letra de alternativa dentro do texto quebraria ao embaralhar
LETRA_SOLTA = re.compile(r"\b[Oo]ption [A-D]\b|\balternative [A-D]\b|\banswer [A-D]\b")

base = Path(__file__).parent
erros = []

for d in range(1, 6):
    sim_p, gab_p = base / f"dominio-{d}_simulado.md", base / f"dominio-{d}_gabarito.md"
    sim, gab = sim_p.read_text("utf-8").split("\n"), gab_p.read_text("utf-8").split("\n")

    # --- simulado: cada questao tem 4 alternativas A..D, sem repeticao
    qs_sim, atual, opts = [], None, []
    for l in sim:
        if (m := HEAD_SIM.match(l)):
            if atual:
                qs_sim.append((atual, opts))
            atual, opts = int(m.group(1)), []
        elif (m := OPT_SIM.match(l)) and atual:
            opts.append((m.group(1), m.group(2)))
    if atual:
        qs_sim.append((atual, opts))

    for n, opts in qs_sim:
        letras = [l for l, _ in opts]
        if letras != ["A", "B", "C", "D"]:
            erros.append(f"D{d} Q{n} simulado: letras {letras}")
        textos = [t for _, t in opts]
        if len(set(textos)) != 4:
            erros.append(f"D{d} Q{n} simulado: alternativa duplicada")
        for t in textos:
            if LETRA_SOLTA.search(t):
                erros.append(f"D{d} Q{n} simulado: texto referencia letra de alternativa")

    # --- gabarito: 4 bullets, exatamente um ✅, letra do ✅ = cabecalho
    qs_gab, atual, resp, bullets = [], None, None, []
    for l in gab:
        if (m := HEAD_GAB.match(l)):
            if atual:
                qs_gab.append((atual, resp, bullets))
            atual, resp, bullets = int(m.group(1)), m.group(2), []
        elif (m := OPT_GAB.match(l)) and atual:
            bullets.append((m.group(1), m.group(2)))
    if atual:
        qs_gab.append((atual, resp, bullets))

    dist = Counter()
    for n, resp, bullets in qs_gab:
        letras = [l for l, _ in bullets]
        if letras != ["A", "B", "C", "D"]:
            erros.append(f"D{d} Q{n} gabarito: letras {letras}")
        certas = [l for l, mark in bullets if mark == "✅"]
        if len(certas) != 1:
            erros.append(f"D{d} Q{n} gabarito: {len(certas)} alternativas marcadas ✅")
        elif certas[0] != resp:
            erros.append(f"D{d} Q{n}: cabecalho diz {resp} mas ✅ esta em {certas[0]}")
        dist[resp] += 1

    nums_sim = [n for n, _ in qs_sim]
    nums_gab = [n for n, _, _ in qs_gab]
    if nums_sim != nums_gab:
        erros.append(f"D{d}: numeracao divergente entre simulado e gabarito")
    if nums_sim != list(range(1, 61)):
        erros.append(f"D{d}: esperado Q1..Q60, encontrado {len(nums_sim)} questoes")

    print(f"dominio {d}: {len(qs_sim)}q simulado · {len(qs_gab)}q gabarito · "
          f"corretas {dict(sorted(dist.items()))}")

print()
if erros:
    print(f"{len(erros)} PROBLEMA(S):")
    for e in erros:
        print(f"  - {e}")
    sys.exit(1)
print("OK — 300 questoes, formato e sincronia integros.")
