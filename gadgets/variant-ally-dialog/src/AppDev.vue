<!-- Vite dev server. This script is never run in the browser! -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import VAVariantPrompt from './components/VAVariantPrompt.vue';
import VAVariantPromptMobile from './components/VAVariantPromptMobile.vue';
import { ValidVariant } from 'ext.gadget.VariantAlly';
import { isMobileDevice, wgUserVariant } from './utils';

const variantInput = ref<HTMLInputElement | null>(null);
const isMobile = isMobileDevice();
const colorScheme = ref<'light' | 'night' | 'os'>('light');

onMounted(() => {
  if (variantInput.value !== null) {
    variantInput.value.value = wgUserVariant.value;
  }
});

watch(
  colorScheme,
  (newValue, oldValue) => {
    const classList = document.documentElement.classList;
    classList.remove(`skin-theme-clientpref-${oldValue}`);
    classList.add(`skin-theme-clientpref-${newValue}`);
  },
  { immediate: true },
);

function setUserVariant() {
  if (variantInput.value !== null) {
    wgUserVariant.value = variantInput.value.value;
  }
}

// VariantPrompt

const variantPrompt = ref<InstanceType<typeof VAVariantPrompt> | null>(null);
const isVPOpen = ref(false);
const isVPDisabled = ref(false);
const closeVPOnMouseLeave = ref(false);
const closeVPOnScroll = ref(false);

function onVPOptOut() {
  alert('Opt outed!');
}


function onVPSelect(variant: ValidVariant) {
  alert(`Selected ${variant}`);
}

// Browser support: iOS Safari < 15
// Work around Safari firing scroll event at unexpected conditions (e.g. popping up Select)
addEventListener(isMobile ? 'touchmove' : 'scroll', () => {
  if (closeVPOnScroll.value && !isVPDisabled.value) {
    isVPOpen.value = false;
  }
});

// VariantPromptMobile

const variantPromptMobile = ref<InstanceType<typeof VAVariantPromptMobile> | null>(null);
const isVPMOpen = ref(false);
const isVPMDisabled = ref(false);
const closeVPMOnScroll = ref(false);

function onVPMOptOut() {
  alert('Opt outed!');
}


function onVPMSelect(variant: ValidVariant) {
  alert(`Selected ${variant}`);
}

addEventListener(isMobile ? 'touchmove' : 'scroll', () => {
  if (closeVPMOnScroll.value && !isVPMDisabled.value) {
    isVPMOpen.value = false;
  }
});

</script>

<template>
  <h1>VariantAllyDialog dev server</h1>
  <div>
    <p>
      Color scheme: <select v-model="colorScheme">
        <option value="light">
          Light
        </option>
        <option value="night">
          Dark
        </option>
        <option value="os">
          Auto
        </option>
      </select>
    </p>
    <p>
      wgUserVariant: <input ref="variantInput">
      <button @click="setUserVariant">
        Set
      </button>
    </p>
  </div>

  <div>
    <h2>VAVariantPrompt.vue</h2>
    <p>Open: {{ isVPOpen }}</p>
    <button @click="isVPOpen = !isVPOpen">
      Toggle dialog
    </button>
    <label>
      <input
        v-model="isVPDisabled"
        type="checkbox"
      >
      Disabled
    </label>
    <label>
      <input
        v-model="closeVPOnMouseLeave"
        type="checkbox"
      >
      Close on mouse leave
    </label>
    <label>
      <input
        v-model="closeVPOnScroll"
        type="checkbox"
      >
      Close on scroll
    </label>
  </div>

  <div>
    <h2>VAVariantPromptMobile.vue</h2>
    <p>Open: {{ isVPMOpen }}</p>
    <button @click="isVPMOpen = !isVPMOpen">
      Toggle dialog
    </button>
    <label>
      <input
        v-model="isVPMDisabled"
        type="checkbox"
      >
      Disabled
    </label>
    <label>
      <input
        v-model="closeVPMOnScroll"
        type="checkbox"
      >
      Close on scroll
    </label>
  </div>

  <Teleport to="body">
    <VAVariantPrompt
      ref="variantPrompt"
      v-model:open="isVPOpen"
      v-model:disabled="isVPDisabled"
      :auto-close="closeVPOnMouseLeave"
      @optout="onVPOptOut"
      @select="onVPSelect"
    />

    <VAVariantPromptMobile
      ref="variantPromptMobile"
      v-model:open="isVPMOpen"
      v-model:disabled="isVPMDisabled"
      @optout="onVPMOptOut"
      @select="onVPMSelect"
    />
  </Teleport>
</template>

<style lang="less">
@import './styles/dev-vars.less';
</style>
