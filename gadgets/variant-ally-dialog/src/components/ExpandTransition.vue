<template>
  <Transition
    name="expand"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.expand-enter-active,
.expand-leave-active {
  transition-property: @transition-property-layout;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.expand-enter-from,
.expand-leave-to {
  transform: scale(0.97);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}
</style>
