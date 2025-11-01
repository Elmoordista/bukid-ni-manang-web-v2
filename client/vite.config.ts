/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@shared', replacement: path.resolve(__dirname, '../shared') },
      { find: '@assets', replacement: path.resolve(__dirname, '../attached_assets') },
      { find: '@app', replacement: path.resolve(__dirname, './app') },
      { find: '@components', replacement: path.resolve(__dirname, './components') }
    ]
  },
  base: '/',
  server: {
    port: 5177,
    host: 'localhost',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      strict: true,
      allow: ['..']
    },
    open: true,
    cors: true,
    hmr: {
      overlay: true
    },
    middlewareMode: false
  },
  appType: 'spa',
  preview: {
    port: 5177,
    strictPort: true
  },
  optimizeDeps: {
    exclude: ['public/attached_assets/*'] // Exclude the problematic HTML files
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});