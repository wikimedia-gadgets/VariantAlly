<template>
  <Transition
    name="va-lang-switch"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.va-lang-switch-enter-active,
.va-lang-switch-leave-active {
  transition-property: @transition-property-fade;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.va-lang-switch-enter-from,
.va-lang-switch-leave-to {
  opacity: 0;
}
</style>
