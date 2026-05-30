import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  target: "es2022",
});
