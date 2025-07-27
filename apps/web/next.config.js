const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bookmark-pro/ui'],
  experimental: {
    optimizePackageImports: ['@bookmark-pro/ui'],
  },
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  },
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      config.resolve.alias['@bookmark-pro/ui'] = require('path').resolve(__dirname, '../../packages/ui/src');
    }
    return config;
  },
}

module.exports = nextConfig