import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [dts({
    tsconfigPath: "./tsconfig.lib.json",
  })],
  build: {
    lib: {
      entry: {
        "mod": "./lib/mod.ts",
        "rubikcube/mod": "./lib/rubikcube/mod.ts",
        "three/mod": "./lib/three/mod.ts",
      },
      name: "mod",
      fileName: "mod",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@result/result",
        "@core/iterutil",
        "@core/iterutil/pipe",
        "@core/pipe",
        "@std/encoding",
        "three",
      ],
      output: {
        entryFileNames: `[name].js`,
        preserveModules: true,
      },
    },
  },
});
