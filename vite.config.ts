
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './client',
  base: '/',
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    fs: {
      strict: false,
      allow: ['..']
    },
    hmr: {
      overlay: false,
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
      '@ui': path.resolve(__dirname, './client/src/components/ui')
    }
  },
  publicDir: '../attached_assets'
});
