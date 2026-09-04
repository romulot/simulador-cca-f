import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fixa a raiz do Turbopack neste projeto para evitar inferência incorreta por lockfile legado fora do repositório.
    root: __dirname,
  },
};

export default nextConfig;
