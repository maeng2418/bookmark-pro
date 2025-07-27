import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      fs: {
        allow: [".."],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        "@bookmark-pro/ui": mode === "development" 
          ? resolve(__dirname, "../../packages/ui/src") 
          : resolve(__dirname, "../../packages/ui/dist"),
      },
    },
    optimizeDeps: {
      include: ["@bookmark-pro/ui"],
    },
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'popup.html'),
          background: resolve(__dirname, 'src/background.ts'),
          content: resolve(__dirname, 'src/content.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'popup' ? 'popup.js' : '[name].js';
          },
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify(env.SUPABASE_PUBLISHABLE_KEY),
    },
  }
})