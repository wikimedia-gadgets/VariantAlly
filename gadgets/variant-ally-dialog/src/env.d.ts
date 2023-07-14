/// <reference types="vite/client" />

import { createApp } from 'vue';

module 'vue' {
  export const createMwApp: typeof createApp;
}

export default {};
