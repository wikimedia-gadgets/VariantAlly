<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ expand: boolean }>();

const wrapper = ref<HTMLElement | null>(null);

// HACK: Use JavaScript to detect and set height manually because
// (1) transition from and to an auto height is not possible; and
// (2) scrollHeight does not have reactivity in Vue
function setExpandedHeight(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = `${wrapper.value?.scrollHeight ?? '0'}px`;
  }
}

function setCollapsedHeight(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = '0';
  }
}

function deleteHeight(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = '';
  }
}
</script>

<template>
  <Transition
    name="va-expand"
    mode="out-in"
    @before-enter="setCollapsedHeight"
    @before-leave="setExpandedHeight"
    @enter="setExpandedHeight"
    @leave="setCollapsedHeight"
    @after-enter="deleteHeight"
    @after-leave="deleteHeight"
  >
    <!-- Use v-show instead of v-if to make scrollHeight work -->
    <div
      v-show="expand"
      ref="wrapper"
      class="va-expand-wrapper"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.va-expand-wrapper {
  overflow-y: hidden;
}

.va-expand-enter-active,
.va-expand-leave-active {
  transition-property: @transition-property-layout;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.va-expand-enter-from,
.va-expand-leave-to {
  transform: scale(0.97);
}
</style>
