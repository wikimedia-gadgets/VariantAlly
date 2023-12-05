// Additional types.

/// <reference types="vite/client" />
/// <reference types="../../../node_modules/types-mediawiki"/>

import { createApp } from 'vue';

module 'vue' {
  export const createMwApp: typeof createApp;
}

export default {};
