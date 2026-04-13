import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    sourcemap: true,
    target: 'esnext',
    dts: { enabled: true, oxc: true },
    exports: true,
    clean: true,
    globalName: 'Mande',
  },
])
