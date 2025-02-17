// vitest.config.ts or vite.config.ts (js)
import { defineConfig } from "vitest/config"; // or `import { defineConfig } from 'vite';`

export default defineConfig({
  test: {
    includeSource: [
      "./src/**/*.test.[jt]s?(x)",
    ],
  },
});
