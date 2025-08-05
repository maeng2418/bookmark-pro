import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import tsconfigPaths from "vite-tsconfig-paths";

function generateManifest() {
  const manifest = readJsonFile("manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, "../.."), "");

  console.log(env.SUPABASE_PUBLISHABLE_KEY);

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      webExtension({
        manifest: generateManifest,
        watchFilePaths: ["package.json", "manifest.json"],
        disableAutoLaunch: true,
        additionalInputs: [
          "src/popup.html",
          "src/oauth-callback.html",
          "src/oauth-callback.js",
        ],
      }),
      svgr(),
    ],
    server: {
      fs: {
        allow: [".."],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@bookmark-pro/ui":
          mode === "development"
            ? resolve(__dirname, "../../packages/ui/src")
            : resolve(__dirname, "../../packages/ui/dist"),
      },
    },
    optimizeDeps: {
      include: ["@bookmark-pro/ui"],
    },
    build: {
      rollupOptions: {
        external: ["/@react-refresh"],
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        env.SUPABASE_PUBLISHABLE_KEY
      ),
      "process.env.WEB_URL": JSON.stringify(env.WEB_URL),
    },
  };
});
