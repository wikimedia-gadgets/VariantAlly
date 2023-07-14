<script setup lang="ts">
defineEmits(['click']);
</script>

<template>
  <button
    class="variant-button"
    @click="$emit('click')"
  >
    <svg
      class="variant-button__icon"
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

  background-color: @background-color-base;
  color: @color-progressive;
  border-color: @border-color-progressive;

  padding-top: @spacing-vertical-variant-button;
  padding-bottom: @spacing-vertical-variant-button;
  font-size: @font-size-large;
  text-align: left;

  display: flex;
  align-items: center;

  &:hover {
    color: @color-progressive--hover;
    background-color: @background-color-progressive-subtle;

    .variant-button__icon {
      fill: @color-progressive--hover;
    }
  }

  &:active {
    color: @color-inverted;
    background-color: @background-color-progressive--active;
    border-color: @border-color-progressive--active;

    .variant-button__icon {
      fill: @color-inverted;
    }
  }

  &:focus {
    outline: @outline-base--focus;
  }

  &:focus:not(:active) {
    border-color: @border-color-progressive--focus;
    box-shadow: @box-shadow-progressive--focus;
  }

  &__icon {
    margin-right: @spacing-25;
    fill: @color-progressive;
    transition-property: fill;
    transition-duration: @transition-duration-base;
  }
}
</style>
