import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/core/index.ts",
    "src/react/index.ts",
    // We'll add globs for submodules, but tsup globs need to be handled carefuly.
    // For now explicit entry points matching package.json exports is safest,
    // or using a glob for the specific sub-directories.
    "src/games/*.ts",
    "src/facts/*.ts",
    "src/doodle/*.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  minify: process.env.NODE_ENV === "production",
});
