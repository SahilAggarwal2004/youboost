import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";

import manifest from "./manifest.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), crx({ manifest }), zip({ outDir: "release", outFileName: "release.zip" })],
  server: { port: 3000, cors: { origin: [/chrome-extension:\/\//] } },
});
