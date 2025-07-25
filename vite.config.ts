import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import manifest from "./manifest.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), crx({ manifest })],
  server: { port: 3000 },
});
