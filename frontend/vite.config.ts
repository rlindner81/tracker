import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";
import { execSync } from "node:child_process";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// https://vitejs.dev/config/#using-environment-variables-in-config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const gitCommit = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  return {
    // https://vitejs.dev/config/shared-options.html#define
    define: {
      __VITE_MODE__: JSON.stringify(mode),
      __GIT_COMMIT__: JSON.stringify(gitCommit),
    },
    plugins: [
      vue(),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/i18n/locales/**"),
      }),
      vuetify(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
        },
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          description: "TrackIt allows you to track interesting or curious events in your life in a structured way.",
          icons: [
            {
              src: "./img/icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "./img/icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          start_url: "./",
          display: "standalone",
          background_color: "#f8f9fa",
          theme_color: "#1b4965",
        },
      }),
    ],
    publicDir: env.VITE_PUBLIC_DIR,
    // https://github.com/vitejs/vite/issues/2204
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://0.0.0.0:8000",
          changeOrigin: true,
        },
      },
    },
    // see https://github.com/firebase/firebase-js-sdk/issues/6926
    optimizeDeps: {
      exclude: ["firebase/app", "firebase/auth", "firebase/firestore"],
    },
  };
});
