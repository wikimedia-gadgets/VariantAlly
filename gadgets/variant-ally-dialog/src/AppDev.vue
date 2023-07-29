<!-- Vite dev server. This script is never run in the browser! -->

<script setup lang="ts">
import { ref } from 'vue';
import { currentLocale } from './message';
import VariantDialog from './components/VariantDialog.vue';

const isDialogOpen = ref(false);
const variantDialog = ref<InstanceType<typeof VariantDialog> | null>(null);

function onSelect(variant: string) {
  alert(`Selected ${variant}`);
}

</script>

<template>
  <h1>VariantAllyDialog dev server</h1>

  <div class="high">
    <button @click="isDialogOpen = !isDialogOpen">
      Toggle dialog
    </button>

    <p>currentLocale: {{ currentLocale }}</p>
    <button @click="currentLocale = 'zh-hans'">
      Set locale to zh-hans
    </button>
    <button @click="currentLocale = 'zh-hant'">
      Set locale to zh-hant
    </button>
    <button @click="currentLocale = 'en'">
      Set locale to en
    </button>
  </div>

  <Teleport to="body">
    <VariantDialog
      ref="variantDialog"
      v-model:open="isDialogOpen"
      @select="onSelect"
    />
  </Teleport>
</template>

<style lang="less">
.high {
  position: relative;
  //z-index: calc(400 + 1);
  width: fit-content;
}
</style>
