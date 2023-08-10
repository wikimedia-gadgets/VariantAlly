<template>
  <Transition
    name="lang-switch"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.lang-switch-enter-active,
.lang-switch-leave-active {
  transition-property: @transition-property-fade;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;

  @media (prefers-reduced-motion) {
    transition-duration: 0s;
  }
}

.lang-switch-enter-from,
.lang-switch-leave-to {
  opacity: 0;
}
</style>
