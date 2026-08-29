import { defineConfig } from 'vite';
const buildId = process.env.VITE_BUILD_ID || 'polish-3';

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: new URL('index.html', import.meta.url).pathname,
        privacy: new URL('privacy/index.html', import.meta.url).pathname,
        terms: new URL('terms/index.html', import.meta.url).pathname,
      },
    },
  },
});
