import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "TrackIt",
        short_name: "TrackIt",
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
        background_color: "#FFFFFF",
        theme_color: "#4DBA87",
      },
    }),
  ],
  // https://github.com/vitejs/vite/issues/2204
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      ...(process.env.NODE_ENV === "production" && {
        vue: "https://cdn.jsdelivr.net/npm/vue@3.2.47/+esm",
        "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@4.1.6/+esm",
        pinia: "https://cdn.jsdelivr.net/npm/pinia@2.0.30/+esm",
        "firebase/app": "https://cdn.jsdelivr.net/npm/firebase@9.17.1/app/+esm",
        "firebase/auth": "https://cdn.jsdelivr.net/npm/firebase@9.17.1/auth/+esm",
        "firebase/firestore": "https://cdn.jsdelivr.net/npm/firebase@9.17.1/firestore/+esm",
        "export-from-json": "https://cdn.jsdelivr.net/npm/export-from-json@1.7.2/+esm",
      }),
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
    exclude:
      process.env.NODE_ENV === "production"
        ? ["vue", "vue-router", "pinia", "firebase/app", "firebase/auth", "firebase/firestore", "export-from-json"]
        : ["firebase/app", "firebase/auth", "firebase/firestore"],
  },
});
