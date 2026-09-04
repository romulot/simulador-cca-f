import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";

import "./globals.css";

// Auto-hospedadas pelo Next.js em build time (arquivo baixado uma vez,
// servido do próprio app depois) — o container Docker não depende de rede
// para carregar fonte nenhuma em runtime.
const fonteCorpo = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-corpo",
  display: "swap",
});

const fonteInstrumento = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-instrumento",
  display: "swap",
});

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
    <html lang="pt-BR" className={`${fonteCorpo.variable} ${fonteInstrumento.variable}`}>
      <body>{children}</body>
    </html>
  );
}
