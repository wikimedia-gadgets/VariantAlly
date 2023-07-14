<script setup lang="ts">
import { msg } from '../msg';

defineEmits(['click']);
</script>

<template>
  <button
    class="back-button"
    :title="msg('back')"
    :aria-label="msg('back')"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      width="20"
      height="20"
      class="back-button__icon"
      viewBox="2 2 16.02 16.02"
    >
      <g>
        <path d="m5.83 9 5.58-5.58L10 2l-8 8 8 8 1.41-1.41L5.83 11H18V9z" />
      </g>
    </svg>
  </button>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.back-button {
  .button-base();

  background-color: @background-color-transparent;
  border-color: @border-color-transparent;
  padding: @spacing-back-button;

  &__icon {
    vertical-align: middle;
  }

  &:hover {
    background-color: @background-color-button-quiet--hover;
  }

  &:active {
    background-color: @background-color-button-quiet--active;
    color: @color-emphasized;
    border-color: @border-color-interactive;
  }

  &:focus {
    outline: @outline-base--focus;
  }

  &:focus:not( :active) {
    border-color: @border-color-progressive--focus;
    box-shadow: @box-shadow-progressive--focus;
  }
}
</style>
