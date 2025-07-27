import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

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
      config.resolve.alias['@bookmark-pro/ui'] = path.resolve(__dirname, '../../packages/ui/src');
    }
    return config;
  },
}

export default nextConfig;