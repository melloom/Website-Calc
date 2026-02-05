/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Empty turbopack config to enable webpack customizations
  turbopack: {},
  // Fix WebSocket HMR connection issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Static export configuration for Netlify
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig
