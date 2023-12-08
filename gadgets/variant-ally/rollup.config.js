// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { readFileSync, readdirSync, statSync } from 'fs';
import replace from '@rollup/plugin-replace';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import { createHash } from 'crypto';
import { join } from 'path';
import strip from '@rollup/plugin-strip';
import filesize from 'rollup-plugin-filesize';

/**
 * @param {string} str
 */
function strToBool(str) {
  return ['false', 'no'].includes(String(str).trim().toLowerCase())
    ? false
    : Boolean(str);
}

const production = process.env.NODE_ENV === 'production';
const statEnable = process.env.VA_STAT_ENABLE !== undefined
  ? strToBool(process.env.VA_STAT_ENABLE)
  : production;

/**
 * Compute a meta hash based on metadata of files inside paths.
 *
 * From https://stackoverflow.com/a/76425794
 *
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
    dir: 'dist',
    entryFileNames: 'Gadget-VariantAlly.js',
    format: 'cjs',
    generatedCode: 'es5', // Keep in sync with TS target
    banner: readFileSync('assets/intro.js').toString().trim(),
    footer: readFileSync('assets/outro.js').toString().trim(),
  },
  plugins: [
    filesize(),
    replace({
      preventAssignment: true,
      STAT_ENABLE: statEnable,
      BUILD_HASH: JSON.stringify(computeMetaHash(['src/'])),
    }),
    typescript({
      compilerOptions: {
        // Default gadget requires ES5
        // Specify here so tests can be run without transpilation
        target: 'ES5',
      },
    }),
    mwGadget({
      gadgetDef: '.gadgetdefinition',
      softDependencies: ['ext.gadget.VariantAllyDialog'],
    }),
    production && strip({
      include: ['**/*.ts'],
      // Remove calls to debug functions in production
      functions: ['console.*', 'assert.*', 'output', 'checkDebugURLParam'],
    }),
  ],
});
