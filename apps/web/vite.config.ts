import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [".."],
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@bookmark-pro/ui": mode === "development" 
        ? path.resolve(__dirname, "../../packages/ui/src") 
        : "@bookmark-pro/ui",
    },
  },
  optimizeDeps: {
    include: ["@bookmark-pro/ui"],
  },
}));
