/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Garantir que o servidor rode na porta 3000
  serverRuntimeConfig: {
    port: 3000
  },
  // Configuração de output para garantir servidor standalone
  output: 'standalone',
};

export default nextConfig;
