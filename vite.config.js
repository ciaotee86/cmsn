import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    host: true,
    port: 3000,
    open: false
  },
  preview: {
    host: true,
    port: 3000
  }
});
