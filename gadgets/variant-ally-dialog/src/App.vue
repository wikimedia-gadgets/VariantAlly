<script setup lang="ts">
import { ref, watch } from 'vue';
import { setLocalVariant, redirect, ValidVariant, setOptOut, stat } from 'ext.gadget.VariantAlly';
import VAVariantPrompt from './components/VAVariantPrompt.vue';

const isOpen = ref(true);
const isDisabled = ref(false);

function setVariant(variant: ValidVariant) {
  stat('variant-prompt-select');
  setLocalVariant(variant);
  redirect(variant);
}

addEventListener('scroll', () => {
  if (!isDisabled.value) {
    isOpen.value = false;
  }
});

function onOptOut() {
  stat('variant-prompt-optout');
  setOptOut();
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    stat('variant-prompt-dismiss');
  }
});
</script>

<template>
  <VAVariantPrompt
    v-model:open="isOpen"
    v-model:disabled="isDisabled"
    :auto-close="true"
    @optout="onOptOut"
    @select="setVariant"
  />
</template>


<style lang="less">
@import (reference) './styles/tokens.less';

.va-variant-prompt {

  // Vector 2022 specific adjustments
  .skin-vector-2022 & {
    .vector-toc-available.vector-feature-toc-pinned-clientpref-1 & {
      @media screen and (min-width: 1000px) and (max-width: 1200px) {
        left: unset;

        // Calculated from Vector 2022 source code
        // In this width this prompt will not obscure article content
        margin-left: -(2.75em / 3 * 2);
        max-width: calc(12.25em + 36px);
        padding: @spacing-100;
      }
    }

    @media screen and (min-width: 1200px) {
      left: unset;
      margin-left: -(3.25em / 3 * 2);
      max-width: calc(15.75em + 36px);
    }
  }
}
</style>
