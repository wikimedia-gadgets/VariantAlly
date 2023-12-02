<!-- Vite dev server. This script is never run in the browser! -->

<script setup lang="ts">
import { watch, ref } from 'vue';
import useSyncedRef from './composables/useSyncedRef';
import VAVariantPrompt from './components/VAVariantPrompt.vue';
import { onMounted } from 'vue';
import { wgUserVariant } from './composables/useI18n';

const isVariantPromptOpen = ref(false);
const closeOnMouseLeave = ref(false);
const closeOnScroll = ref(false);
const variantPrompt = ref<InstanceType<typeof VAVariantPrompt> | null>(null);
const selectedVariant = useSyncedRef('var', '');
const variantInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (variantInput.value !== null) {
    variantInput.value.value = wgUserVariant.value;
  }
});

watch(selectedVariant, (newValue) => {
  alert(`Selected ${newValue}`);
});

addEventListener('scroll', () => {
  if (closeOnScroll.value) {
    isVariantPromptOpen.value = false;
  }
});

function onOptOut() {
  alert('Opt outed!');
}

function setUserVariant() {
  if (variantInput.value !== null) {
    wgUserVariant.value = variantInput.value.value;
  }
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
      :auto-close="closeOnMouseLeave"
      @optout="onOptOut"
      @select="(variant) => { selectedVariant = variant; }"
    />
  </Teleport>
</template>

<style lang="less"></style>
