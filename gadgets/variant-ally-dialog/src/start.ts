// Start Vite dev server. This script is never run in production!

import './mediawiki-shim';
import { createApp } from 'vue';
import DevSandbox from './AppDev.vue';

createApp(DevSandbox).mount('#app');
