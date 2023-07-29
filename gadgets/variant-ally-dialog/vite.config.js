// @ts-check

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ command }) => {
  const production = command === 'build';

  return {
    esbuild: {
      banner: readFileSync('assets/intro.js').toString(),
      footer: readFileSync('assets/outro.js').toString(),
    },
    define: {
      DEBUG: JSON.stringify(!production),
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs'],
      },
      target: ['es2016'], // MediaWiki's JavaScript minifier supports up to ES2016
      rollupOptions: {
        output: {
          entryFileNames: 'Gadget-VariantAllyDialog.js',
          chunkFileNames: 'Gadget-VariantAllyDialog-[name].js',
          assetFileNames: 'Gadget-VariantAllyDialog.css',
        },
      },
      minify: 'terser', // Use terser for smaller bundle size
      terserOptions: {
        format: {
          // Reserve intro && outro
          comments: /(^\*!|nowiki|SPDX-License-Identifier)/i,
        },
      },
    },
    plugins: [
      vue(),
      {
        enforce: 'pre',
        ...mwGadget({
          gadgetDef: 'gadget-def.txt',
        }),
      },
    ],
  };
});
