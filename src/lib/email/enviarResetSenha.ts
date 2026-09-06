interface MensagemReset {
  destinatario: string;
  link: string;
}

export async function enviarResetSenha({ destinatario, link }: MensagemReset): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const remetente = process.env.EMAIL_FROM;
  if (!apiKey || !remetente) throw new Error("Serviço de e-mail não configurado.");

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: remetente,
      to: [destinatario],
      subject: "Redefina sua senha no Simulador CCA-F",
      text: `Use este link para redefinir sua senha. Ele expira em 30 minutos:\n\n${link}`,
    }),
  });
  if (!resposta.ok) throw new Error(`Falha ao enviar e-mail de recuperação (${resposta.status}).`);
}
