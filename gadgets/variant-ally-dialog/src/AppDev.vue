<!-- Vite dev server. This script is never run in the browser! -->

<script setup lang="ts">
import { ref } from 'vue';
import VAVariantPrompt from './components/VAVariantPrompt.vue';
import VASelect from './components/VASelect.vue';
import { onMounted } from 'vue';
import { wgUserVariant } from './composables/useI18n';
import { ValidVariant } from 'ext.gadget.VariantAlly';

const isVariantPromptOpen = ref(false);
const isVariantPromptDisabled = ref(false);
const isVariantPromptMobile = ref(false);
const closeOnMouseLeave = ref(false);
const closeOnScroll = ref(false);
const variantPrompt = ref<InstanceType<typeof VAVariantPrompt> | null>(null);
const variantInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (variantInput.value !== null) {
    variantInput.value.value = wgUserVariant.value;
  }
});

addEventListener('scroll', () => {
  if (closeOnScroll.value && !isVariantPromptDisabled.value) {
    isVariantPromptOpen.value = false;
  }
});

function setUserVariant() {
  if (variantInput.value !== null) {
    wgUserVariant.value = variantInput.value.value;
  }
}

function onVariantPromptOptOut() {
  alert('Opt outed!');
}


function onVariantPromptSelect(variant: ValidVariant) {
  alert(`Selected ${variant}`);
}
</script>

<template>
  <h1>VariantAllyDialog dev server</h1>
  <div>
    <p>wgUserVariant: <input ref="variantInput">
      <button @click="setUserVariant">
        Set
      </button>
    </p>
  </div>

  <div>
    <h2>VAVariantPrompt.vue</h2>
    <p>Open: {{ isVariantPromptOpen }}</p>
    <button @click="isVariantPromptOpen = !isVariantPromptOpen">
      Toggle dialog
    </button>
    <label>
      <input
        v-model="isVariantPromptDisabled"
        type="checkbox"
      >
      Disabled
    </label>
    <label>
      <input
        v-model="isVariantPromptMobile"
        type="checkbox"
      >
      Mobile
    </label>
    <label>
      <input
        v-model="closeOnMouseLeave"
        type="checkbox"
      >
      Close on mouse leave
    </label>
    <label>
      <input
        v-model="closeOnScroll"
        type="checkbox"
      >
      Close on scroll
    </label>
  </div>

  <Teleport to="body">
    <VAVariantPrompt
      ref="variantPrompt"
      v-model:open="isVariantPromptOpen"
      v-model:disabled="isVariantPromptDisabled"
      :mobile="isVariantPromptMobile"
      :auto-close="closeOnMouseLeave"
      @optout="onVariantPromptOptOut"
      @select="onVariantPromptSelect"
    />
  </Teleport>
</template>

<style lang="less"></style>
