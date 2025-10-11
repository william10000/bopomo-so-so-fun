import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/bopomo-so-so-fun/',
  build: { outDir: 'docs', emptyOutDir: true },
  plugins: [react()],
  server: {
    port: 3008,
    host: 'localhost'
  },
  preview: {
    port: 3008,
    host: 'localhost'
  }
});


