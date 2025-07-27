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
}

module.exports = nextConfig