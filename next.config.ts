import type { NextConfig } from "next";
import withPWA from "next-pwa";

// Tipando corretamente o config com PWA
const nextConfig: NextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

export default nextConfig;
