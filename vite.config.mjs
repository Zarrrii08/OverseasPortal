import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      proxy: {
        "/ODOverseasPortalAPI": {
          target: "https://odenhanced.language-empire.net",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    preview: {
      proxy: {
        "/ODOverseasPortalAPI": {
          target: "https://odenhanced.language-empire.net",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    }
  };
});