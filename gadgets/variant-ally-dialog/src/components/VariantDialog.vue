<!-- Variant selection prompt. -->

<script setup lang="ts">
import { ref } from 'vue';
import { msg } from '../msg';

const enum Page {
  MAIN,
  MORE,
  TROUBLESHOOT,
  QUIT
}

const currentPage = ref(Page.MAIN);

// For debugging purpose
defineExpose({ currentPage });

</script>

<template>
  <Transition name="fade" appear>
    <div class="variant-dialog">
      <Transition name="switch">
        <!-- Main panel -->
        <div v-if="currentPage === Page.MAIN" class="variant-dialog__main">
          <h2 class="variant-dialog__main__title">
            {{ msg('main.heading') }}
          </h2>
          <div class="variant-dialog__main__body">
            <p class="variant-dialog__main__body__desc">
              {{ msg('main.desc') }}<a href="#">{{ msg('main.desc.ext') }}</a>
            </p>
            <div class="variant-dialog__main__body__options"></div>
          </div>
          <footer class="variant-dialog__main__footer">
            <p>
              {{ msg('main.footer') }}<a href="#">{{ msg('main.footer.ext') }}</a>
            </p>
          </footer>
        </div>

        <!-- More panel -->
        <div v-else-if="currentPage === Page.MORE" class="variant-dialog__more">
          <p>{{ msg('more.desc.1') }}</p>
          <p>{{ msg('more.desc.2') }}</p>
          <p>{{ msg('more.desc.3') }}</p>
        </div>

        <!-- Troubleshoot panel -->
        <div v-else-if="currentPage === Page.TROUBLESHOOT" class="variant-dialog__troubleshoot">
          <p>{{ msg('troubleshoot.desc.1') }}</p>
          <p>{{ msg('troubleshoot.desc.2') }}</p>
        </div>

        <!-- Quit confirmation panel -->
        <div v-else class="variant-dialog__quit">
          <h2>{{ msg('quit.heading') }}</h2>
          <p>{{ msg('quit.desc') }}</p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="less">
@import '../styles/reset.less';
@import (reference) '../styles/mixins.less';
@import (reference) '../styles/tokens.less';

.variant-dialog {
  position: fixed;
  z-index: @z-index-overlay;
  top: 50%;
  left: 50%;
  width: 40em;
  height: 20em;
  transform: translateX(-50%) translateY(-50%);
  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;
  padding: @spacing-100 @spacing-150;
  overflow: hidden;

  &__main {
    &__title {}

    &__body {
      &__desc {}
    }
  }
}

a {
  .link-base();
}

.switch-enter-active,
.switch-leave-active {
  //position: absolute;
  transition-property: transform;
  transition-duration: 2s;
  transition-timing-function: @transition-timing-function-user;
}

.switch-enter-from {
  transform: translateX(-100%);
}

.switch-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition-property: @transition-property-fade;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
