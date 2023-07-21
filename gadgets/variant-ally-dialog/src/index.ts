// Lib entry point.

import { createMwApp } from 'vue';
import VariantDialog from './components/VariantDialog.vue';
import { redirect, setLocalVariant } from 'ext.gadget.VariantAlly';

const root = document.createElement('div');
document.body.appendChild(root);

createMwApp(
  VariantDialog,
  {
    open: true,
    onSelect(variant: string) {
      setLocalVariant(variant);
      redirect(variant);
    },
  },
).mount(root);
