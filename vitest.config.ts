/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Include test files (exclude e2e tests which use Playwright)
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],

    // Global test timeout
    testTimeout: 10000,

    // Enable global test APIs (describe, it, expect)
    globals: true,

    // Environment for running tests
    environment: 'node',

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        'src/env.d.ts',
        'src/**/*.d.ts',
        'src/**/*.astro',
        'node_modules/**',
      ],
    },
  },
});
