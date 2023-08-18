<script setup lang="ts">
defineEmits(['click']);
</script>

<template>
  <button
    class="va-variant-button"
    @click="$emit('click')"
  >
    <svg
      class="va-variant-button__icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="18"
      height="18"
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

.va-variant-button {
  .button-base();

  background-color: @background-color-base;
  color: @color-progressive;
  border-color: @border-color-progressive;

  padding-top: @spacing-vertical-button;
  padding-bottom: @spacing-vertical-button;
  font-size: @font-size-medium;
  text-align: left;

  display: flex;
  align-items: center;

  &:hover {
    color: @color-progressive--hover;
    background-color: @background-color-progressive-subtle;
  }

  &:active {
    color: @color-inverted;
    background-color: @background-color-progressive--active;
    border-color: @border-color-progressive--active;
  }

  &:focus {
    outline: @outline-base--focus;

    &:not(:active) {
      border-color: @border-color-progressive--focus;
      box-shadow: @box-shadow-progressive--focus;
    }
  }

  &__icon {
    margin-right: @spacing-25;
    fill: currentColor;
  }

  @media screen and (max-width: @max-width-breakpoint-mobile) {
    font-size: @font-size-small;
    text-align: center;
    justify-content: center;

    padding-left: @spacing-horizontal-button--mobile;
    padding-right: @spacing-horizontal-button--mobile;

    &__icon {
      display: none;
    }
  }
}
</style>
