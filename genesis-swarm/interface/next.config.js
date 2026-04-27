/** @type {import('next').NextConfig} */
const nextConfig = {
    // Toujours sur localhost:3000 — jamais d'IP réseau exposée
    hostname: 'localhost',
    port: 3000,
    reactStrictMode: true,
    // Désactivation du telemetry Next.js en production
    env: {
        CORE_ENGINE_URL: process.env.CORE_ENGINE_URL || 'http://localhost:8080',
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws',
    }
};

module.exports = nextConfig;
