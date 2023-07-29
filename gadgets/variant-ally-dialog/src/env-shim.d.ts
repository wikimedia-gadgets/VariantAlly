// Additional types (module argumentation).

import { createApp } from 'vue';

module 'vue' {
  export const createMwApp: typeof createApp;
}

export default {};
