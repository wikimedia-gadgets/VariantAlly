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
  <div class="variant-dialog">

    <div v-if="currentPage === Page.MAIN" class="variant-dialog__main">
      <h2 class="variant-dialog__main__title">
        {{ msg('main.heading') }}
      </h2>
      <div class="variant-dialog__main__body">
        <p class="variant-dialog__main__body__desc">
          {{ msg('main.desc') }}{{ msg('main.desc.ext') }}
        </p>
        <div class="variant-dialog__main__body__options"></div>
      </div>
      <footer class="variant-dialog__main__footer">
        {{ msg('main.footer') }}{{ msg('main.footer.ext') }}
      </footer>
    </div>

    <div v-else-if="currentPage === Page.MORE" class="variant-dialog__more">
      <p>{{ msg('more.desc.1') }}</p>
      <p>{{ msg('more.desc.2') }}</p>
      <p>{{ msg('more.desc.3') }}</p>
    </div>

    <div v-else-if="currentPage === Page.TROUBLESHOOT" class="variant-dialog__troubleshoot">
      <p>{{ msg('troubleshoot.desc.1') }}</p>
      <p>{{ msg('troubleshoot.desc.2') }}</p>
    </div>

    <div v-else class="variant-dialog__quit">
      <h2>{{ msg('quit.heading') }}</h2>
      <p>{{ msg('quit.desc') }}</p>
    </div>

  </div>
</template>

<style scoped lang="less">
@import '../styles/reset.less';
@import (reference) '../styles/tokens.less';

.variant-dialog {
  position: fixed;
  z-index: @z-index-overlay;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;
  padding: @spacing-100 @spacing-150;

  &__main {
    &__title {}

    &__body {
      &__desc {}
    }
  }


}
</style>
