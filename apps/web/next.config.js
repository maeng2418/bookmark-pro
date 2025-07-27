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
}

module.exports = nextConfig