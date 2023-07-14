// Lib entry point.

import { createMwApp } from 'vue';
import VariantDialog from './components/VariantDialog.vue';

const root = document.createElement('div');
document.body.appendChild(root);
createMwApp(VariantDialog).mount(root);
