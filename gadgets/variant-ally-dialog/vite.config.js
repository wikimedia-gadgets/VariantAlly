// @ts-check

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import autoprefixer from 'autoprefixer';
import browserslistToEsbuild from './scripts/browserslist-to-esbuild';

export default defineConfig(({ command }) => {
  return {
    esbuild: {
      banner: readFileSync('../../assets/intro.js').toString().trim(),
      footer: readFileSync('../../assets/outro.js').toString().trim(),
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
    },
    resolve: {
      alias: command === 'serve' ? {
        'ext.gadget.VariantAlly': '../variant-ally/src/index',
      } : undefined,
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs'],
      },
      target: ['es2016'], // MediaWiki >= 1.42.0-wmf.13 supports up to ES2016
      cssTarget: browserslistToEsbuild(), // Tell esbuild not to use too modern CSS features
      rollupOptions: {
        output: {
          entryFileNames: 'Gadget-VariantAllyDialog.js',
          chunkFileNames: 'Gadget-VariantAllyDialog-[name].js',
          assetFileNames: 'Gadget-VariantAllyDialog.css',
        },
      },
      minify: false,
    },
    plugins: [
      vue(),
      {
        enforce: 'pre',
        ...mwGadget({
          gadgetDef: '.gadgetdefinition',
        }),
      },
    ],
  };
});
