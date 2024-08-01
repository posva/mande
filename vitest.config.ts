import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    typecheck: {
      enabled: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src'],
      exclude: [
        'src/index.ts',
        'src/**/*.test-d.ts',
        // TODO: remove once implemented
        'src/interceptors.ts',
      ],
    },
  },
})
