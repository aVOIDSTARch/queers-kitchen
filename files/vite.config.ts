// vite.config.ts
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { apiPlugin } from "./src/lib/apiPlugin";

export default defineConfig({
  plugins: [react(), apiPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 4321,
    open: true,
  },
});
