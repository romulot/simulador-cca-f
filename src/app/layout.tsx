import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulador CCA-F",
  description: "Simulador de provas para a certificação Claude Architect Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
