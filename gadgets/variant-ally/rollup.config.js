// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import { randomBytes } from 'crypto';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/Gadget-VariantAlly.js',
    format: 'cjs',
    generatedCode: 'es5', // Keep in sync with tsconfig.json
    banner: readFileSync('assets/intro.js').toString(),
    footer: readFileSync('assets/outro.js').toString(),
  },
  plugins: [
    replace({
      preventAssignment: true,
      DEBUG: JSON.stringify(!production),
      BUILD_HASH: JSON.stringify(randomBytes(3).toString('hex')),
    }),
    typescript(),
    terser({
      format: {
        // Reserve intro && outro
        comments: /(^\*!|nowiki|SPDX-License-Identifier)/i,
        ecma: 5, // Keep in sync with tsconfig.json
      },
    }),
    mwGadget({
      gadgetDef: 'gadget-def.txt',
      softDependencies: ['ext.gadget.VariantAllyDialog'],
      legacy: true,
    }),
  ],
});
