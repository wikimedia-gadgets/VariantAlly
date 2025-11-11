// @ts-check

import browserslist from 'browserslist';

/**
 * Convert the browserslist field in package.json to esbuild compatible array of browsers.
 * From: https://github.com/marcofugaro/browserslist-to-esbuild, licensed under MIT.
 *
 * @param {string[]|string} [browserslistConfig]
 * @returns {string[]}
 */
function browserslistToEsbuild(browserslistConfig) {
  if (!browserslistConfig) {
    // The path from where the script is run
    const path = process.cwd();

    // Read config if none is passed
    browserslistConfig = browserslist.loadConfig({ path });
  }

  const SUPPORTED_ESBUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari'];

  // https://github.com/eBay/browserslist-config/issues/16#issuecomment-863870093
  const UNSUPPORTED = ['android 4'];

  const replaces = /** @type {Record<string,string>} */ ({
    ios_saf: 'ios',
    android: 'chrome',
  });

  const separator = ' ';

  return (
    browserslist(browserslistConfig)
      // Filter out the unsupported ones
      .filter((b) => !UNSUPPORTED.some((u) => b.startsWith(u)))
      // Transform into ['chrome', '88']
      .map((b) => b.split(separator))
      // Replace the similar browser
      .map((b) => {
        if (replaces[b[0]]) {
          b[0] = replaces[b[0]];
        }

        return b;
      })
      // 11.0-12.0 --> 11.0
      .map((b) => {
        if (b[1].includes('-')) {
          b[1] = b[1].slice(0, b[1].indexOf('-'));
        }

        return b;
      })
      // 11.0 --> 11
      .map((b) => {
        if (b[1].endsWith('.0')) {
          b[1] = b[1].slice(0, -2);
        }

        return b;
      })
      // Only get the ones supported by esbuild
      .filter((b) => SUPPORTED_ESBUILD_TARGETS.includes(b[0]))
      // Only get the oldest version
      .reduce(
        /** @param {string[][]} acc */
        (acc, b) => {
          const existingIndex = acc.findIndex((br) => br[0] === b[0]);

          if (existingIndex !== -1) {
            acc[existingIndex][1] = b[1];
          } else {
            acc.push(b);
          }
          return acc;
        },
        [],
      )
      // Remove separator
      .map((b) => b.join(''))
  );
}

export default browserslistToEsbuild;
