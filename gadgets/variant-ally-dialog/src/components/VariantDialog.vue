<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { currentLocale, cycleLocale } from '../message';
import { msg } from '../message';
import LangSwitchTransition from './LangSwitchTransition.vue';
import ExpandTransition from './ExpandTransition.vue';
import VariantButton from './VariantButton.vue';
import IconButton from './IconButton.vue';
import useUniqueId from '../composables/useUniqueId';


const VARIANTS = ['cn', 'sg', 'my', 'hk', 'mo', 'tw'];

const dialog = ref<HTMLElement | null>(null);
const focusKeeper = ref<HTMLElement | null>(null);

const titleId = useUniqueId();
const descId = useUniqueId();
const isExtendedDescriptionVisible = ref(false);

const props = defineProps<{
  open: boolean,
}>();
const emit = defineEmits<{
  (e: 'select', variant: string): void;
  (e: 'update:open', value: boolean): void;
}>();

watchEffect(() => {
  if (props.open) {
    focusKeeper.value?.focus();
  }
});

/**
 * Focus the first or last focusable element inside the dialog.
 * @param last focus last element, first element otherwise
 */
function focusInsideDialog(last: boolean) {
  if (dialog.value === null) {
    return;
  }
  let focusableElements: HTMLElement[] = Array.from(dialog.value.querySelectorAll('button, a'));
  if (last) {
    focusableElements = focusableElements.reverse();
  }
  for (const element of focusableElements) {
    // Try focus the element, may fail
    element.focus();

    if (document.activeElement === element) {
      return;
    }
  }
}

function close() {
  emit('update:open', false);
}

</script>

<template>
  <Transition
    name="dialog"
    appear
  >
    <div
      v-if="open"
      class="variant-dialog-backdrop"
      @click="close"
      @keyup.escape="close"
    >
      <div
        ref="dialog"
        class="variant-dialog"
        role="dialog"
        aria-model="false"
        :aria-labelledby="titleId"
        :aria-describedby="descId"
        @click.stop
      >
        <!-- Focus trap start & keeper -->
        <div
          tabindex="0"
          @focus="focusInsideDialog(true)"
        />
        <div
          ref="focusKeeper"
          class="variant-dialog__focus-keeper"
          tabindex="-1"
        />

        <div class="variant-dialog__header">
          <LangSwitchTransition>
            <h2
              :id="titleId"
              :key="currentLocale"
              :lang="currentLocale"
              class="variant-dialog__header__title"
            >
              {{ msg('title') }}
            </h2>
          </LangSwitchTransition>
          <IconButton
            icon="lang"
            title="切换语言 / 切換語言 / Switch languages"
            aria-label="切换语言 / 切換語言 / Switch languages"
            @click="cycleLocale"
          />
          <IconButton
            icon="close"
            :title="msg('close')"
            :aria-label="msg('close')"
            @click="close"
          />
        </div>

        <LangSwitchTransition>
          <div
            :key="currentLocale"
            class="variant-dialog__body"
            :lang="currentLocale"
          >
            <div class="variant-dialog__body__desc-group">
              <p
                :id="descId"
                class="variant-dialog__body__desc-group__desc"
              >
                {{ msg('desc') }}{{ msg('space') }}<a
                  href="#"
                  @click="isExtendedDescriptionVisible = !isExtendedDescriptionVisible"
                >{{ msg('desc.btn') }}</a>
              </p>
              <ExpandTransition>
                <div
                  v-if="isExtendedDescriptionVisible"
                  class="variant-dialog__body__desc-group__ext"
                >
                  <p class="variant-dialog__body__desc-group__ext__text">
                    {{ msg('desc.ext.1') }}
                  </p>
                  <p class="variant-dialog__body__desc-group__ext__text">
                    {{ msg('desc.ext.2') }}
                  </p>
                  <p class="variant-dialog__body__desc-group__ext__text">
                    {{ msg('desc.ext.3') }}
                  </p>
                </div>
              </ExpandTransition>
            </div>

            <div class="variant-dialog__body__options">
              <VariantButton
                v-for="variant in VARIANTS"
                :key="variant"
                :lang="currentLocale === 'en' ? 'en' : `zh-${variant}`"
                @click="$emit('select', `zh-${variant}`)"
              >
                {{ msg(`vb.${variant}`) }}
              </VariantButton>
            </div>
          </div>
        </LangSwitchTransition>

        <LangSwitchTransition>
          <footer
            :key="currentLocale"
            class="variant-dialog__footer"
            :lang="currentLocale"
          >
            <p>
              {{ msg('footer.1') }}
            </p>
            <p>
              <!-- Disable link because it's unfinished -->
              {{ msg('footer.2') }}{{ msg('space') }}<a href="#">{{ msg('footer.2.btn') }}</a>
            </p>
          </footer>
        </LangSwitchTransition>

        <!-- Focus trap end -->
        <div
          tabindex="0"
          @focus="focusInsideDialog(false)"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';
@import (reference) '../styles/tokens.less';

/* Global normalization */
:deep {
  @import '../styles/normalize.less';
}

.variant-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: @z-index-overlay-backdrop;
  background-color: @background-color-backdrop-light;

  display: flex;
  align-items: center;
  justify-content: center;
}

.variant-dialog {
  z-index: @z-index-overlay;
  padding: @spacing-125 @spacing-200;
  width: 100%;
  max-width: 42em;

  overflow: auto;
  overscroll-behavior: none;
  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;

  font-family: @font-family-system-sans;

  &__focus-keeper {
    position: absolute;

    &:focus {
      outline: 0;
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

  &__header {
    display: flex;
    align-items: center;
    margin-right: -(@spacing-back-button + 1px);

    @media screen and (max-width: @max-width-breakpoint-mobile) {
      text-align: center;
      margin: @spacing-50 0;
      font-size: @font-size-x-large;
    }

    &__title {
      flex: 1;
    }
  }

  &__body {
    &__desc-group {
      &__desc {
        margin-bottom: @spacing-0;
      }

      &__ext {
        font-size: @font-size-small;
        color: @color-subtle;
        margin: @spacing-75 @spacing-0;
        overflow-y: hidden;

        &__text {
          color: @color-subtle;
          margin-bottom: @spacing-35;
        }
      }
    }

    &__options {
      display: grid;
      gap: @spacing-35;
      grid-auto-flow: column;
      grid-template: 1fr 1fr 1fr / 1fr 1fr;
      margin: @spacing-100 0;

      @media screen and (max-width: @max-width-breakpoint-mobile) {
        grid-template: 1fr 1fr / 1fr 1fr 1fr;
      }
    }
  }
}

/* Dialog transition effect */
.dialog-enter-active,
.dialog-leave-active {
  transition-property: @transition-property-fade, @transition-property-layout;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.dialog-enter-from,
.dialog-leave-to {
  @media screen {
    @media (min-width: @min-width-breakpoint-tablet) {
      opacity: 0;
    }

    @media (max-width: @max-width-breakpoint-mobile) {
      transform: translateY(100%);
    }
  }
}
</style>
