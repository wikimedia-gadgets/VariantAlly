<script setup lang="ts">
import { setLocalVariant, redirect } from 'ext.gadget.VariantAlly';
import { ref } from 'vue';
import VariantDialog from './components/VariantDialog.vue';

const isDialogOpen = ref(false);

function setVariantAndRedirect(variant: string) {
  setLocalVariant(variant);
  redirect(variant);
}
</script>

<template>
  <Teleport to="body">
    <VariantDialog
      v-model:open="isDialogOpen"
      @select="setVariantAndRedirect"
    />
  </Teleport>
</template>
