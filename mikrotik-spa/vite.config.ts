import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

const brand = process.env.VITE_BRAND || 'default';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  define: {
    'process.env.VITE_BRAND': JSON.stringify(brand),
  },
  build: {
    assetsInlineLimit: 100000000, // Forces all assets to be inlined
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: `dist/${brand}`,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js', // singleFile plugin will handle this
      },
    },
  },
  resolve: {
    alias: {
      '@brand': path.resolve(__dirname, `./src/brands/${brand}`),
    },
  },
});
