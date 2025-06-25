import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          ai: ['@google/generative-ai'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    hmr: {
      overlay: false,
    },
    host: true,
    port: 5173,
  },
  preview: {
    port: 4173,
    host: true,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});