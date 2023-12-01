<script setup lang="ts">
import { ref } from 'vue';
import { setLocalVariant, redirect, ValidVariant } from 'ext.gadget.VariantAlly';
import VAVariantPrompt from './components/VAVariantPrompt.vue';

const isDialogOpen = ref(true);

function setVariant(variant: ValidVariant) {
  setLocalVariant(variant);
  redirect(variant);
}

addEventListener('scroll', () => {
  isDialogOpen.value = false;
});
</script>

<template>
  <Teleport to="body">
    <VAVariantPrompt
      v-model:open="isDialogOpen"
      :auto-close="true"
      @select="setVariant"
    />
  </Teleport>
</template>
