// Lib entry point.

import { createMwApp } from 'vue';
import VariantDialog from './components/VariantDialog.vue';
import { rewriteCurrentURL, setPreferredVariant } from './management';

const root = document.createElement('div');
document.body.appendChild(root);

createMwApp(
  VariantDialog,
  {
    onselect(variant: string) {
      setPreferredVariant(variant);
      // Use replace() to prevent navigating back
      location.replace(rewriteCurrentURL(variant));
    },
  },
).mount(root);
