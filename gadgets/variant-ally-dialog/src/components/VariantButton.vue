<script setup lang="ts">
const emit = defineEmits(['click']);

function onClick() {
  emit('click');
}
</script>

<template>
  <button
    class="variant-button"
    @click="onClick"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <g>
        <path d="M8.59 3.42 14.17 9H2v2h12.17l-5.58 5.59L10 18l8-8-8-8z" />
      </g>
    </svg>
    <slot />
  </button>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.variant-button {
  .button-base();

  appearance: none;
  background-color: @background-color-interactive-subtle;
  color: @color-progressive;
  border-color: @border-color-progressive;
  padding-top: @spacing-vertical-variant-button;
  padding-bottom: @spacing-vertical-variant-button;
  font-size: @font-size-large;

  &:hover {}

  &:active {}

  &:focus:not(:active) {}
}
</style>
