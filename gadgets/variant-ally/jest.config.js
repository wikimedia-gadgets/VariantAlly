// @ts-check

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  setupFiles: [
    './test/setup.ts',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
};
