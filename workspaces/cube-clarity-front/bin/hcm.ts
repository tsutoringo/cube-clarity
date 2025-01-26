import { run } from "npm:happy-css-modules";

await run({
  pattern: "src/**/*.module.css",
  outDir: "generated/hcm",
  watch: true,
  declarationMap: true,
  localsConvention: 'camelCaseOnly'
});
