import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), crx({ manifest })],
    server: { port: 3000 },
  };
});
