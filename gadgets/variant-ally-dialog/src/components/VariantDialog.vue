<!-- Variant selection prompt. -->

<script setup lang="ts">
import { ref } from 'vue';
import { currentLocale, msg } from '../msg';
import VariantButton from './VariantButton.vue';
import BackButton from './BackButton.vue';
import LangButton from './LangButton.vue';

const enum Page {
  MAIN,
  MORE,
  TROUBLESHOOT,
  QUIT
}
const currentPage = ref(Page.MAIN);

defineEmits<{
  (e: 'select', variant: string): void;
}>();

// For debugging purpose
defineExpose({ currentPage });

</script>

<template>
  <Transition
    name="dialog"
    appear
  >
    <div
      class="variant-dialog"
      :lang="currentLocale"
    >
      <Transition
        name="panel"
        mode="out-in"
      >
        <!-- Main panel -->
        <div
          v-if="currentPage === Page.MAIN"
          class="variant-dialog__main"
        >
          <div class="variant-dialog__main__heading">
            <h2 class="variant-dialog__main__heading__title">
              {{ msg('main.heading') }}
            </h2>
            <LangButton />
          </div>
          <div class="variant-dialog__main__body">
            <p class="variant-dialog__main__body__desc">
              {{ msg('main.desc') }}<a
                href="#"
                @click.prevent="currentPage = Page.MORE"
              >{{ msg('main.desc.ext') }}</a>
            </p>
            <div class="variant-dialog__main__body__options">
              <VariantButton @click="$emit('select', 'zh-cn')">{{ msg('main.zh-cn') }}
              </VariantButton>
              <VariantButton @click="$emit('select', 'zh-sg')">{{ msg('main.zh-sg') }}
              </VariantButton>
              <VariantButton @click="$emit('select', 'zh-my')">{{ msg('main.zh-my') }}
              </VariantButton>
              <VariantButton @click="$emit('select', 'zh-hk')">{{ msg('main.zh-hk') }}
              </VariantButton>
              <VariantButton @click="$emit('select', 'zh-mo')">{{ msg('main.zh-mo') }}
              </VariantButton>
              <VariantButton @click="$emit('select', 'zh-tw')">{{ msg('main.zh-tw') }}
              </VariantButton>
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
          <div class="variant-dialog__more__heading">
            <BackButton
              class="variant-dialog__more__heading__back"
              @click="currentPage = Page.MAIN"
            />
            <h2>{{ msg('more.heading') }}</h2>
          </div>
          <div>
            <p>{{ msg('more.desc.1') }}</p>
            <p>{{ msg('more.desc.2') }}</p>
            <p>{{ msg('more.desc.3') }}</p>
          </div>
        </div>

        <!-- Troubleshoot panel -->
        <div
          v-else-if="currentPage === Page.TROUBLESHOOT"
          class="variant-dialog__troubleshoot"
        >
          <div class="variant-dialog__troubleshoot__heading">
            <BackButton
              class="variant-dialog__troubleshoot__heading__back"
              @click="currentPage = Page.MAIN"
            />
            <h2>{{ msg('troubleshoot.heading') }}</h2>
          </div>
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
  transform: translate(-50%, -50%);

  max-width: 42em;
  width: 100%;

  z-index: @z-index-overlay;
  padding: @spacing-125 @spacing-200;

  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;

  font-family: @font-family-base;

  @media screen and (max-width: @max-width-breakpoint-mobile) {
    transform: none;
    left: auto;
    top: auto;
    bottom: 0;
    min-height: 50%;
    overflow: scroll;
    padding: @spacing-100;
    overscroll-behavior: none;
  }

  &__main {
    &__heading {
      display: flex;
      align-items: center;

      @media screen and (min-width: @min-width-breakpoint-tablet) {
        margin-right: -(@spacing-back-button + 1px);

        &__title {
          flex: 1;
        }
      }

      @media screen and (max-width: @max-width-breakpoint-mobile) {
        flex-direction: column-reverse;
        justify-content: center;

        &__title {
          text-align: center;
          margin: @spacing-50 0;
          font-size: @font-size-x-large;
        }
      }
    }

    &__body {
      &__desc {}

      &__options {
        display: grid;
        gap: @spacing-35;
        grid-auto-flow: column;
        grid-template: 1fr 1fr 1fr / 1fr 1fr;
        margin: @spacing-100 0;

        @media screen and (max-width: @max-width-breakpoint-mobile) {
          grid-template: 1fr 1fr /1fr 1fr 1fr;
        }
      }
    }
  }

  &__more {
    &__heading {
      display: flex;
      align-items: center;

      &__back {
        margin-right: @spacing-30;
        margin-left: -(@spacing-back-button + 1px);
      }
    }
  }

  &__troubleshoot {
    &__heading {
      display: flex;
      align-items: center;

      &__back {
        margin-right: @spacing-30;
        margin-left: -(@spacing-back-button + 1px);
      }
    }
  }
}

a {
  .link-base();
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
