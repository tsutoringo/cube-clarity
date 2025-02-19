/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

console.log(resolve(import.meta.dirname, "./src/assets/"));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  resolve: {
    alias: {
      "@components": resolve(import.meta.dirname, "./src/components"),
      "@layouts": resolve(import.meta.dirname, "./src/layouts"),
      "@lib": resolve(import.meta.dirname, "./src/lib"),
      "@assets": resolve(import.meta.dirname, "./src/assets"),
    },
  },
});
