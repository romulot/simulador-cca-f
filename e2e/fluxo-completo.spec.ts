import { expect, test } from "@playwright/test";

/** Fluxo completo: menu → seleção → rodada → resultado → histórico.
 *
 * Cobre o caminho feliz do app inteiro numa sessão de navegador real —
 * as rotas de API já têm sua própria suíte (Vitest, `yarn test`); este
 * teste garante que a integração entre elas e as 5 telas funciona de
 * ponta a ponta, incluindo o que só existe no navegador (navegação por
 * clique, atalhos de teclado, confirmação de finalização).
 */

test("menu → praticar → responder → finalizar → resultado → histórico", async ({ page }) => {
  const erros: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") erros.push(msg.text());
  });
  page.on("pageerror", (err) => erros.push(String(err)));

  await test.step("menu carrega com contagens", async () => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Simulador CCA-F" })).toBeVisible();
    await expect(page.getByText(/simulados,.*questões/)).toBeVisible();
  });

  await test.step("seleção: marca um tópico e começa", async () => {
    await page.getByRole("link", { name: /Praticar/ }).click();
    await expect(page.getByText("DOMÍNIO 1")).toBeVisible();

    const primeiroCheckbox = page.locator("input[type=checkbox]:not([disabled])").first();
    await primeiroCheckbox.check();
    await expect(page.getByText(/1 simulados selecionados/)).toBeVisible();

    await page.getByRole("button", { name: "Começar" }).click();
    await page.waitForURL(/\/rodada\/\d+/);
  });

  let ultimoTexto = "";
  await test.step("responde todas as questões (sempre A) via clique", async () => {
    await expect(page.getByText(/Questão 1\//)).toBeVisible();

    for (let tentativa = 0; tentativa < 20; tentativa++) {
      const botaoA = page.getByRole("button", { name: /^A\)/ });
      await botaoA.click();
      await page.waitForTimeout(250);

      ultimoTexto = (await page.getByText(/Questão \d+\/\d+/).textContent()) ?? "";
      const [, atualStr, totalStr] = ultimoTexto.match(/Questão (\d+)\/(\d+)/) ?? [];
      if (atualStr === totalStr) {
        const pressionado = await botaoA.getAttribute("aria-pressed");
        if (pressionado === "true") break;
      }
    }
  });

  await test.step("finaliza com confirmação explícita", async () => {
    await page.getByRole("button", { name: "Finalizar rodada" }).click();
    await expect(page.getByText(/Finalizar a rodada\?|questão\(ões\) em branco/)).toBeVisible();
    await page.getByRole("button", { name: "Sim, finalizar" }).click();
    await page.waitForURL(/\/resultado\/\d+/);
  });

  await test.step("resultado mostra placar e não trava", async () => {
    await expect(page.getByRole("heading", { name: "Resultado" })).toBeVisible();
    await expect(page.getByText(/\d+\/\d+/).first()).toBeVisible();
  });

  await test.step("cita o corte oficial (720/1000) sem convertê-lo", async () => {
    // Regra de negócio preservada da TUI original: a taxa bruta de acerto
    // nunca vira uma nota na escala 720/1000 — só a referência é citada.
    await expect(page.getByText(/720\/1000/)).toBeVisible();
    await expect(page.getByText(/sem conversão/)).toBeVisible();
  });

  await test.step("histórico lista a rodada recém-finalizada", async () => {
    await page.getByRole("link", { name: "← Menu" }).click();
    await page.getByRole("link", { name: /Histórico/ }).click();
    await expect(page.getByRole("heading", { name: "Histórico" })).toBeVisible();
    await expect(page.getByText("1.1_loop_agentico")).toBeVisible();
  });

  expect(erros, `erros de console/página: ${erros.join("; ")}`).toEqual([]);
});

test("modo prova sorteia 60 questões e mostra o cronômetro regressivo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Modo prova/ }).click();
  await page.waitForURL(/\/rodada\/\d+/);
  await expect(page.getByText("Questão 1/60")).toBeVisible();
  // Cronômetro regressivo começa perto de 2h (120min) — checa o formato MM:SS.
  await expect(page.getByText(/^\d{2,3}:\d{2}$/)).toBeVisible();
});

test("teclado: responder com a tecla A e navegar com as setas", async ({ page }) => {
  await page.goto("/selecao");
  await page.locator("input[type=checkbox]:not([disabled])").first().check();
  await page.getByRole("button", { name: "Começar" }).click();
  await page.waitForURL(/\/rodada\/\d+/);
  await expect(page.getByText(/Questão 1\//)).toBeVisible();

  await page.keyboard.press("a");
  await page.waitForTimeout(300);
  await expect(page.getByText(/Questão 2\//)).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(300);
  await expect(page.getByText(/Questão 1\//)).toBeVisible();
});
