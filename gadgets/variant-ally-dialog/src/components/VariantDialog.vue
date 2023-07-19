<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import MainPanel from './panels/MainPanel.vue';
import MoreInfoPanel from './panels/MoreInfoPanel.vue';
import TroubleshootPanel from './panels/TroubleshootPanel.vue';
import QuitPanel from './panels/QuitPanel.vue';
import LangButton from './buttons/LangButton.vue';
import { currentLocale } from '../msg';
import useUniqueId from '../composables/useUniqueId';

const enum Page {
  MAIN,
  MORE,
  TROUBLESHOOT,
  QUIT
}
const currentPage = ref(Page.MAIN);
const titleIdList = {
  [Page.MAIN]: useUniqueId(),
  [Page.MORE]: useUniqueId(),
  [Page.TROUBLESHOOT]: useUniqueId(),
  [Page.QUIT]: useUniqueId(),
};
const focusHolder = ref<HTMLElement | null>(null);

const props = defineProps<{
  open: boolean,
}>();

defineEmits<{
  (e: 'select', variant: string): void;
}>();

watchEffect(() => {
  if (props.open) {
    focusHolder.value?.focus();
  }
});

// For debugging purpose
defineExpose({ currentPage });

</script>

<template>
  <Transition
    name="dialog"
    appear
  >
    <div
      v-if="open"
      class="variant-dialog"
      role="dialog"
      aria-model="false"
      :aria-labelledby="titleIdList[currentPage]"
    >
      <div
        ref="focusHolder"
        class="variant-dialog__focus-holder"
        tabindex="-1"
      />
      <LangButton class="variant-dialog__lang-button" />
      <Transition
        name="panel"
        mode="out-in"
      >
        <div
          :key="currentLocale"
          :lang="currentLocale"
          class="variant-dialog__content"
        >
          <Transition
            name="panel"
            mode="out-in"
          >
            <MainPanel
              v-if="currentPage === Page.MAIN"
              :title-id="titleIdList[Page.MAIN]"
              @more="currentPage = Page.MORE"
              @troubleshoot="currentPage = Page.TROUBLESHOOT"
              @select="(variant) => { $emit('select', variant); }"
            />
            <MoreInfoPanel
              v-else-if="currentPage === Page.MORE"
              :title-id="titleIdList[Page.MORE]"
              @main="currentPage = Page.MAIN"
            />
            <TroubleshootPanel
              v-else-if="currentPage === Page.TROUBLESHOOT"
              :title-id="titleIdList[Page.TROUBLESHOOT]"
              @main="currentPage = Page.MAIN"
            />
            <QuitPanel
              v-else
              :title-id="titleIdList[Page.QUIT]"
            />
          </Transition>
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
  transform: translate(-50%, -50%);

  max-width: 640px;
  width: 100%;

  z-index: @z-index-overlay;
  padding: @spacing-125 @spacing-200;
  overflow: auto;
  overscroll-behavior: none;

  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;
  font-family: @font-family-system-sans;

  @media screen and (max-width: @max-width-breakpoint-mobile) {
    left: @spacing-35;
    right: @spacing-35;
    top: auto;
    bottom: @spacing-35;
    transform: none;

    max-width: none;
    width: auto;

    padding: @spacing-100;

    display: flex;
    flex-direction: column-reverse;
  }

  /* Styles for thin screens */

  @media screen and (max-height: @max-height-breakpoint-mobile) {
    top: 0;
    bottom: 0;
    transform: translateX(-50%);

    @media (max-width: @max-width-breakpoint-mobile) {
      left: 0;
      right: 0;
      transform: none;
      min-height: auto;
    }
  }

  &__lang-button {
    float: right;
    margin-right: -(@spacing-back-button + 1px);
    margin-top: @spacing-75;

    @media screen and (max-width: @max-width-breakpoint-mobile) {
      float: none;
      margin-top: @spacing-0;
      align-self: center;
    }
  }
}

/* Panel switch transition effect */

.panel-enter-active,
.panel-leave-active {
  transition-property: @transition-property-fade;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-user;
}

.panel-enter-from {
  opacity: 0;
}

.panel-leave-to {
  opacity: 0;
}

/* Dialog transition effect */

.dialog-enter-active,
.dialog-leave-active {
  transition-property: @transition-property-fade, @transition-property-popup;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.dialog-enter-from,
.dialog-leave-to {
  @media screen and (min-width: @min-width-breakpoint-tablet) {
    opacity: 0;
  }

  @media screen and (max-width: @max-width-breakpoint-mobile) {
    transform: translateY(100%);
  }
}
</style>
