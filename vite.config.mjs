import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: env.VITE_URL_DIR || '/',
    envPrefix: ['VITE_'],
    build: {
      target: 'es2018',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: [
              'axios',
              '@twilio/voice-sdk',
              'react-router-dom'
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        "/ODOverseasPortalAPI": {
          target: "https://odenhanced.language-empire.net",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
    preview: {
      proxy: {
        "/ODOverseasPortalAPI": {
          target: "https://odenhanced.language-empire.net",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
  };
});
