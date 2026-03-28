import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].js",
      },
    },
  },
  plugins: [tailwindcss(), react(), crx({ manifest }), zip({ outDir: "release", outFileName: "release.zip" })],
  server: { port: 3000, cors: { origin: [/chrome-extension:\/\//] } },
});
