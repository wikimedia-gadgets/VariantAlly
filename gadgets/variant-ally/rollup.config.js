// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync, readdirSync, statSync } from 'fs';
import replace from '@rollup/plugin-replace';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import { createHash } from 'crypto';
import { join } from 'path';

const production = process.env.NODE_ENV === 'production';

/**
 * Compute a meta hash based on metadata of files inside paths.
 * @param {string[]} paths
 * @param {import('crypto').Hash} [inputHash]
 * @returns
 */
function computeMetaHash(paths, inputHash) {
  const hash = inputHash ? inputHash : createHash('sha1');
  for (const path of paths) {
    const statInfo = statSync(path);
    if (statInfo.isDirectory()) {
      const directoryEntries = readdirSync(path, { withFileTypes: true });
      const fullPaths = directoryEntries.map((e) => join(path, e.name));
      // Recursively walk sub-folders
      computeMetaHash(fullPaths, hash);
    } else {
      const statInfo = statSync(path);
      // Compute hash string name:size
      const fileInfo = `${path}:${statInfo.size}`;
      hash.update(fileInfo);
    }
  }

  // If not being called recursively, get the digest and return it as the hash result
  if (!inputHash) {
    return hash.digest().toString('hex').slice(0, 6);
  }

  return;
}

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
      BUILD_HASH: JSON.stringify(computeMetaHash(['src/'])),
    }),
    typescript({
      compilerOptions: {
        target: 'ES5', // Default gadget requires ES5
      },
    }),
    terser({
      format: {
        // Reserve intro && outro
        comments: /(^\*!|nowiki|SPDX-License-Identifier)/i,
        ecma: 5, // Keep in sync with tsconfig.json
      },
    }),
    mwGadget({
      gadgetDef: '.gadgetdefinition',
      softDependencies: ['ext.gadget.VariantAllyDialog'],
      legacy: true,
    }),
  ],
});
