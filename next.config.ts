import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para permitir el prerenderizado en modo estático
};

export default nextConfig;
