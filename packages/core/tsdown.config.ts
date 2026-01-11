import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  treeshake: true,
  minify: true,
})
