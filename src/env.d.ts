// Additional types.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApp } from 'vue';

declare global {
  // Ambient types goes here

  const DEBUG: boolean;

  module 'vue-shim' {
    export default async function (callback: (vue: typeof import('vue')) => void);
  }
}

module 'vue' {
  const createMwApp: typeof createApp;
}

export { }; // Make this a module so module argumentation works
