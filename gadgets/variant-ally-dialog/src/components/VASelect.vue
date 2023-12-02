<template>
  <select class="va-select">
    <slot />
  </select>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';
@import (reference) '../styles/tokens.less';

.va-select {
  .select__handle();
  appearance: none;
  background-position: center right @spacing-75;
  background-repeat: no-repeat;
  background-image: @icon-expand;
  background-size: @size-icon-x-small;
  min-width: @size-1600;

  &:disabled {
    .select__handle--disabled();
    background-image: @icon-expand-disabled;
    // Support: Chrome, which sets an opacity less than 1 for disabled select elements.
    opacity: @opacity-base;
    cursor: @cursor-not-allowed;
  }

  &:enabled {
    .select__handle--enabled();
  }
}
</style>
