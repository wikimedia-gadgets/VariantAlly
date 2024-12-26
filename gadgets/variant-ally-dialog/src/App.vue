<script setup lang="ts">
import { ref, watch } from 'vue';
import { setLocalVariant, redirect, ValidVariant, setOptOut, stat } from 'ext.gadget.VariantAlly';
import VAVariantPrompt from './components/VAVariantPrompt.vue';
import VAVariantPromptMobile from './components/VAVariantPromptMobile.vue';
import { getMountPoint, isMobileDevice } from './utils';

const isOpen = ref(true);
const isDisabled = ref(false);
const isMobile = isMobileDevice();
const desktopMountPoint = getMountPoint();

stat(isMobile ? 'variant-prompt-mobile-show' : 'variant-prompt-show');

function setVariant(variant: ValidVariant) {
  stat(isMobile ? 'variant-prompt-mobile-select' : 'variant-prompt-select');
  setLocalVariant(variant);
  redirect(variant, { forced: true });
}

// Browser support: iOS Safari < 15
// Work around Safari firing scroll event at unexpected conditions (e.g. popping up Select)
addEventListener(isMobile ? 'touchmove' : 'scroll', () => {
  if (!isDisabled.value) {
    isOpen.value = false;
  }
});

function onOptOut() {
  stat(isMobile ? 'variant-prompt-mobile-optout' : 'variant-prompt-optout');
  setOptOut();
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    stat(isMobile ? 'variant-prompt-mobile-dismiss' : 'variant-prompt-dismiss');
  }
});
</script>

<template>
  <Teleport :to="desktopMountPoint">
    <VAVariantPrompt
      v-if="!isMobile"
      v-model:open="isOpen"
      v-model:disabled="isDisabled"
      :auto-close="false"
      @optout="onOptOut"
      @select="setVariant"
    />
  </Teleport>

  <!-- Teleport to body because they are always floated at bottom -->
  <Teleport to="body">
    <VAVariantPromptMobile
      v-if="isMobile"
      v-model:open="isOpen"
      v-model:disabled="isDisabled"
      @optout="onOptOut"
      @select="setVariant"
    />
  </Teleport>
</template>
