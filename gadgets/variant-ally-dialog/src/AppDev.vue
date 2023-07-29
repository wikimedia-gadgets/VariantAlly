<!-- Vite dev server. This script is never run in the browser! -->

<script setup lang="ts">
import { currentLang } from './message';
import VariantDialog from './components/VariantDialog.vue';
import useSyncedRef from './composables/useSyncedRef';
import { watch } from 'vue';

const isDialogOpen = useSyncedRef('open', false);
const selectedVariant = useSyncedRef('var', '');

watch(selectedVariant, (newValue) => {
  alert(`Selected ${newValue}`);
});

</script>

<template>
  <h1>VariantAllyDialog dev server</h1>

  <div class="high">
    <button @click="isDialogOpen = !isDialogOpen">
      Toggle dialog
    </button>

    <p>currentLang: {{ currentLang }}</p>
    <button @click="currentLang = 'zh-hans'">
      Set locale to zh-hans
    </button>
    <button @click="currentLang = 'zh-hant'">
      Set locale to zh-hant
    </button>
    <button @click="currentLang = 'en'">
      Set locale to en
    </button>
  </div>

  <Teleport to="body">
    <VariantDialog
      ref="variantDialog"
      v-model:open="isDialogOpen"
      @select="(variant) => { selectedVariant = variant; }"
    />
  </Teleport>
</template>

<style lang="less">
.high {
  position: relative;
  // z-index: calc(400 + 1);
  width: fit-content;
}
</style>
