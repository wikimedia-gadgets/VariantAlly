// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import mwGadget from 'rollup-plugin-mediawiki-gadget';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/Gadget-VariantAlly.js',
    format: 'iife',
    banner: readFileSync('assets/intro.js').toString(),
    footer: readFileSync('assets/outro.js').toString(),
  },
  plugins: [
    replace({
      preventAssignment: true,
      DEBUG: JSON.stringify(!production),
    }),
    typescript(),
    terser({
      format: {
        // Reserve intro && outro
        comments: /(^\*!|nowiki|SPDX-License-Identifier)/i,
        ecma: 5,
      },
    }),
    mwGadget({
      gadgetDef: 'gadget-def.txt',
      softDependencies: ['ext.gadget.VariantAllyDialog'],
      legacy: true,
    }),
  ],
});
