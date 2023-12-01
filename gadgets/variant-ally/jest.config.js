// @ts-check

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  setupFiles: [
    './test/setup.ts',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
