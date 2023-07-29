<script setup lang="ts">
import { setLocalVariant, redirect } from 'ext.gadget.VariantAlly';
import { watch } from 'vue';
import VariantDialog from './components/VariantDialog.vue';
import useSyncedRef from './composables/useSyncedRef';

const isDialogOpen = useSyncedRef('open', true);
const selectedVariant = useSyncedRef('var', '');

watch(selectedVariant, (newValue) => {
  setLocalVariant(newValue);
  redirect(newValue);
});

</script>

<template>
  <Teleport to="body">
    <VariantDialog
      v-model:open="isDialogOpen"
      @select="(variant) => { selectedVariant = variant; }"
    />
  </Teleport>
</template>
