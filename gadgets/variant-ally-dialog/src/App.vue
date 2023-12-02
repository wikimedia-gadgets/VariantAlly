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
s
<template>
  <VAVariantPrompt
    v-model:open="isDialogOpen"
    :auto-close="true"
    @select="setVariant"
  />
</template>


<style lang="less">
@import (reference) './styles/tokens.less';

.va-variant-prompt {

  // Vector 2022 specific adjustments
  .vector-toc-available.vector-feature-toc-pinned-clientpref-1 .skin-vector-2022 & {
    @media screen and (min-width: 1000px) and (max-width: 1200px) {
      left: unset;

      // Calculated from Vector 2022 source code
      // In this width this prompt will not obscure article content
      margin-left: -(2.75em / 2);
      max-width: calc(12.25em + 36px);
      padding: @spacing-100;
    }

    @media screen and (min-width: 1200px) {
      left: unset;
      margin-left: -(3.25em / 2);
      max-width: calc(15.75em + 36px);
    }
  }
}
</style>
