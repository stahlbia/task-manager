import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
});
