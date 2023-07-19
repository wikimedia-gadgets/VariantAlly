/// <reference types="vite/client" />

import { createApp, resolveDirective } from 'vue';

module 'vue' {
  export const createMwApp: typeof createApp;
}

export default {};
