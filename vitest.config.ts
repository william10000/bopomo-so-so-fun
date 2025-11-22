import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx', // bootstrapping only
        '**/*.d.ts',
        '**/*.test.tsx',
      ],
      thresholds: {
        lines: 0.85,
        functions: 0.85,
        branches: 0.8,
        statements: 0.85
      }
    }
  }
});


