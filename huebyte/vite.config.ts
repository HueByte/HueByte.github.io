/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    // Above the asyncUtilTimeout in src/test/setup.ts. Lower, and a slow lazy-route import
    // fails as an opaque vitest timeout instead of the Testing Library error that says what
    // it was waiting for.
    testTimeout: 15000,
  },
});
