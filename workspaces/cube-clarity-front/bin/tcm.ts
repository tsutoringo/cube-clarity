import { run } from "npm:typed-css-modules";

await run("./", {
  pattern: "src/**/*.module.css",
  watch: true,
  camelCase: true,
});
