/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast']
        }
      }
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  },
  base: '/',
  server: {
    port: 5177,
    host: 'localhost',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://bukid-ni-manang-api.onrender.com',
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