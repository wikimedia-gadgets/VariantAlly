<!-- Variant selection prompt. -->

<script setup lang="ts">
import { ref } from 'vue';
import { msg } from '../msg';
import VariantButton from './VariantButton.vue';

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
  <Transition
    name="fade"
    appear
  >
    <div class="variant-dialog">
      <Transition
        name="switch"
        mode="out-in"
      >
        <!-- Main panel -->
        <div
          v-if="currentPage === Page.MAIN"
          class="variant-dialog__main"
        >
          <h2 class="variant-dialog__main__title">
            {{ msg('main.heading') }}
          </h2>
          <div class="variant-dialog__main__body">
            <p class="variant-dialog__main__body__desc">
              {{ msg('main.desc') }}<a
                href="#"
                @click.prevent="currentPage = Page.MORE"
              >{{ msg('main.desc.ext') }}</a>
            </p>
            <div class="variant-dialog__main__body__options">
              <VariantButton>{{ msg('main.zh-cn') }}</VariantButton>
              <VariantButton>{{ msg('main.zh-sg') }}</VariantButton>
              <VariantButton>{{ msg('main.zh-my') }}</VariantButton>
              <VariantButton>{{ msg('main.zh-hk') }}</VariantButton>
              <VariantButton>{{ msg('main.zh-mo') }}</VariantButton>
              <VariantButton>{{ msg('main.zh-tw') }}</VariantButton>
            </div>
          </div>
          <footer class="variant-dialog__main__footer">
            <p>
              {{ msg('main.footer') }}<a
                href="#"
                @click.prevent="currentPage = Page.TROUBLESHOOT"
              >{{ msg('main.footer.ext') }}</a>
            </p>
          </footer>
        </div>

        <!-- More panel -->
        <div
          v-else-if="currentPage === Page.MORE"
          class="variant-dialog__more"
        >
          <h2>{{ msg('main.heading') }}</h2>
          <p>{{ msg('more.desc.1') }}</p>
          <p>{{ msg('more.desc.2') }}</p>
          <p>{{ msg('more.desc.3') }}</p>
        </div>

        <!-- Troubleshoot panel -->
        <div
          v-else-if="currentPage === Page.TROUBLESHOOT"
          class="variant-dialog__troubleshoot"
        >
          <h2>{{ msg('main.heading') }}</h2>
          <p>{{ msg('troubleshoot.desc.1') }}</p>
          <p>{{ msg('troubleshoot.desc.2') }}</p>
        </div>

        <!-- Quit confirmation panel -->
        <div
          v-else
          class="variant-dialog__quit"
        >
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
  top: 50%;
  left: 50%;

  max-width: 42em;
  width: 100%;
  min-height: 22em;

  z-index: @z-index-overlay;
  transform: translateX(-50%) translateY(-50%);
  padding: @spacing-125 @spacing-200;
  overflow: hidden;

  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;

  //display: flex;
  //flex-direction: column;
  //justify-content: center;

  &__main {
    &__title {}

    &__body {
      &__desc {}

      &__options {
        display: grid;
        gap: @spacing-35;
        grid-auto-flow: column;
        grid-template: 1fr 1fr 1fr / 1fr 1fr;
        margin: @spacing-100 0;
      }
    }
  }
}

a {
  .link-base();
}

/* Switch panel effect */

.switch-enter-active,
.switch-leave-active {
  transition-property: @transition-property-fade;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-user;
}

.switch-enter-from {
  opacity: 0;
}

.switch-leave-to {
  opacity: 0;
}

/* Window fade effect */

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
