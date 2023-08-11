<template>
  <Transition
    name="va-expand"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.va-expand-enter-active,
.va-expand-leave-active {
  transition-property: @transition-property-layout;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.va-expand-enter-from,
.va-expand-leave-to {
  transform: scale(0.97);
  max-height: 0;
}

.va-expand-enter-to,
.va-expand-leave-from {
  max-height: 500px;
}
</style>
