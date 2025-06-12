import type { NextConfig } from "next";
import withPWA from "next-pwa";

// // Tipando corretamente o config com PWA
// const nextConfig: NextConfig = withPWA({
//   reactStrictMode: true,
//   swcMinify: true,
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//   },
// });

// export default nextConfig;

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

// Configurações gerais do Next
const baseConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// Exporta com PWA
export default withPWA(pwaConfig)(baseConfig);
