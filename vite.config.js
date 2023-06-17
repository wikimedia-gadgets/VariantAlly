// @ts-check

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'fs';

/**
 * Simple plugin to transform dynamic imports to MediaWiki ResourceLoader calls.
 * @param {string[]} externals external modules to handle
 * @returns {import('vite').PluginOption}
 */
function mwDynamicImport(externals) {
  return {
    name: 'mw-dynamic-import',
    renderDynamicImport({ targetModuleId }) {
      if (targetModuleId && externals.includes(targetModuleId)) {
        return {
          left: 'mw.loader.using(',
          right: `).then(require=>require("${targetModuleId}"))`,
        };
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const production = command === 'build';

  return {
    esbuild: {
      banner: readFileSync('src/res/intro.js').toString(),
      footer: readFileSync('src/res/outro.js').toString(),
    },
    define: {
      DEBUG: JSON.stringify(!production),
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
          entryFileNames: () => 'VariantAlly.js',
          chunkFileNames: () => 'VariantAlly-[name].js',
        },
        external: ['vue'],
      },
      minify: 'terser', // Use terser for smaller bundle size
      terserOptions: {
        format: {
          comments: /(^\*!|nowiki)/i, // Preserve banners & nowiki guards
        },
      },
    },
    plugins: [
      vue(),
      mwDynamicImport(['vue']),
    ],
  };
});
