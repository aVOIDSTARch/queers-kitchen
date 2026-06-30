import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { playwright } from "vite-plus/test/browser-playwright";
import { apiPlugin } from "./src/lib/apiPlugin";

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    allowedHosts: ["cook.fail.academy"],
  },
  test: {
    projects: [
      {
        // Node unit tests: pure logic (measurements, recipe-parser).
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/**/*.test.ts"],
          exclude: ["tests/e2e/**"],
        },
      },
      {
        // Browser e2e/smoke tests: real Chromium via Playwright.
        extends: true,
        test: {
          name: "browser",
          include: ["tests/e2e/**/*.test.tsx"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    ignorePatterns: ["files/**", "dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
