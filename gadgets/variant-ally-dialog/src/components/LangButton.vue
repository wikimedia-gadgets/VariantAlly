<script setup lang="ts">
import { currentLocale } from '../msg';

const nextLanguage = (function* () {
  while (true) {
    yield 'en';
    yield 'zh-hant';
    yield 'en';
    yield 'zh-hans';
  }
})();

function switchLanguage() {
  currentLocale.value = nextLanguage.next().value;
}
</script>

<template>
  <button
    class="lang-button"
    title="切换语言 / 切換語言 / Switch languages"
    aria-label="切换语言 / 切換語言 / Switch languages"
    @click="switchLanguage"
  >
    <svg
      class="lang-button__icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="22"
      height="22"
      viewBox="0 2 20 16.02"
      aria-hidden="true"
    >
      <g>
        <!-- eslint-disable -->
        <path d="M20 18h-1.44a.61.61 0 01-.4-.12.81.81 0 01-.23-.31L17 15h-5l-1
          2.54a.77.77 0 01-.22.3.59.59 0 01-.4.14H9l4.55-11.47h1.89zm-3.53-4.31L14.89
          9.5a11.62 11.62 0 01-.39-1.24q-.09.37-.19.69l-.19.56-1.58 4.19zm-6.3-1.58a13.43 13.43 0
          01-2.91-1.41 11.46 11.46 0 002.81-5.37H12V4H7.31a4 4 0 00-.2-.56C6.87 2.79 6.6 2 6.6
          2l-1.47.5s.4.89.6 1.5H0v1.33h2.15A11.23 11.23 0 005 10.7a17.19 17.19 0 01-5 2.1q.56.82.87
          1.38a23.28 23.28 0 005.22-2.51 15.64 15.64 0 003.56 1.77zM3.63 5.33h4.91a8.11 8.11 0
          01-2.45 4.45 9.11 9.11 0 01-2.46-4.45z" />
        <!-- eslint-enable -->
      </g>
    </svg>
  </button>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';

.lang-button {
  .button-base();

  background-color: @background-color-transparent;
  border-color: @border-color-transparent;
  padding: @spacing-lang-button;

  &__icon {
    vertical-align: middle;
  }

  &:hover {
    background-color: @background-color-button-quiet--hover;
  }

  &:active {
    background-color: @background-color-button-quiet--active;
    color: @color-emphasized;
    border-color: @border-color-interactive;
  }

  &:focus {
    outline: @outline-base--focus;
  }

  &:focus:not( :active) {
    border-color: @border-color-progressive--focus;
    box-shadow: @box-shadow-progressive--focus;
  }
}
</style>
