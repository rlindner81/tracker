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
    exclude: ["firebase", "firebase/app", "firebase/auth", "firebase/firestore", "firebase/analytics"],
  },
  build: {
    chunkSizeWarningLimit: 600000,
  },
});
