// @ts-check

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';


export default defineConfig(({ command }) => {
  const production = command === 'build';

  return {
    esbuild: {
      banner: readFileSync('src/res/intro.js').toString(),
      footer: readFileSync('src/res/outro.js').toString(),
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs'],
      },
      target: ['es2016'],
      rollupOptions: {
        output: {
          entryFileNames: () => 'VariantAlly.js',
          chunkFileNames: () => 'VariantAlly-[name].js',
        },
      },
      minify: 'terser',
      terserOptions: {
        format: {
          comments: /(^\*!|nowiki)/i, // Preserve banners & nowiki guards
        },
      },
    },
    plugins: [
      vue(),
      replace({
        preventAssignment: true,
        DEBUG: JSON.stringify(!production),
      }),
    ],
  };
});
