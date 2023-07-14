<!-- Vite dev server sandbox. -->

<script setup lang="ts">
import { ref } from 'vue';
import VariantDialog from './VariantDialog.vue';
import { currentLocale } from '../msg';
import { onMounted } from 'vue';

const isDialogVisible = ref(false);
const variantDialog = ref<InstanceType<typeof VariantDialog> | null>(null);

function setPage(page: number) {
  if (variantDialog.value === null) {
    return;
  }
  variantDialog.value.currentPage = page;
}

</script>

<template>
  <h1>VariantAllyDialog dev server</h1>

  <button @click="isDialogVisible = !isDialogVisible">
    Toggle dialog
  </button>

  <div>
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

  <div>
    <button @click="setPage(0)">
      Set page to MAIN
    </button>
    <button @click="setPage(1)">
      Set page to MORE
    </button>
    <button @click="setPage(2)">
      Set page to TROUBLESHOOT
    </button>
    <button @click="setPage(3)">
      Set page to QUIT
    </button>
  </div>

  <Teleport to="body">
    <VariantDialog v-show="isDialogVisible" ref="variantDialog" />
  </Teleport>
</template>

<style></style>
