// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { readFileSync, readdirSync, statSync } from 'fs';
import replace from '@rollup/plugin-replace';
import mwGadget from 'rollup-plugin-mediawiki-gadget';
import { createHash } from 'crypto';
import { join } from 'path';
import strip from '@rollup/plugin-strip';

const production = process.env.NODE_ENV === 'production';

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
    replace({
      preventAssignment: true,
      BUILD_HASH: JSON.stringify(computeMetaHash(['src/'])),
    }),
    typescript({
      compilerOptions: {
        // MediaWiki >= 1.42.0-wmf.13 supports ES2016
        target: 'ES2016',
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
