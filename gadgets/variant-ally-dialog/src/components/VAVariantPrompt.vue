<script setup lang="ts">
import { ref, watch } from 'vue';
import { ValidVariant } from 'ext.gadget.VariantAlly';
import VAButton from './VAButton.vue';
import VAFadeTransition from './VAFadeTransition.vue';
import useI18n, { currentVariant } from '../composables/useI18n';
import useUniqueId from '../composables/useUniqueId';
import useShuffledVariant from '../composables/useShuffledVariant';
import messages from '../../assets/messages.json';

const VARIANTS = ['cn', 'sg', 'my', 'hk', 'mo', 'tw'] as const;

const prompt = ref<HTMLElement | null>(null);

const titleId = useUniqueId();
const descId = useUniqueId();
const shuffledVariant = useShuffledVariant();

const props = withDefaults(defineProps<{
  open: boolean,
  autoClose?: boolean,
}>(), {
  autoClose: false,
});
const emit = defineEmits<{
  (e: 'select', variant: ValidVariant): void;
  (e: 'optout'): void;
  (e: 'update:open', value: boolean): void;
}>();

function optOutAndClose() {
  emit('optout');
  emit('update:open', false);
}

watch(prompt, () => {
  const element = prompt.value;
  if (element !== null) {
    element.addEventListener('mouseleave', (ev) => {
      // Do not dismiss if any button is pressed
      if (ev.buttons === 0 && props.autoClose) {
        emit('update:open', false);
      }
    });
  }
});
</script>

<template>
  <Transition
    name="va-variant-prompt"
    appear
  >
    <div
      v-if="open"
      ref="prompt"
      :lang="`zh-${currentVariant}`"
      class="va-variant-prompt"
      role="dialog"
      aria-modal="false"
      :aria-labelledby="titleId"
      :aria-describedby="descId"
    >
      <VAButton
        class="va-variant-prompt__close"
        weight="quiet"
        icon="close"
        :title="useI18n('close')"
        :aria-label="useI18n('close')"
        @click="optOutAndClose"
      />
      <h2
        :id="titleId"
        class="va-variant-prompt__header va-title"
      >
        {{ useI18n('vn.header') }}<br>
        <VAFadeTransition>
          <span
            :key="shuffledVariant"
            :lang="`zh-${shuffledVariant}`"
            class="va-variant-prompt__header__variant"
          >{{ messages.variants[shuffledVariant] }}</span>
        </VAFadeTransition>
      </h2>
      <div class="va-variant-prompt__body">
        <p
          :id="descId"
          class="va-para"
        >
          {{ useI18n('vn.main') }}
        </p>
        <div class="va-variant-prompt__body__options">
          <VAButton
            v-for="variant in VARIANTS"
            :key="variant"
            class="va-variant-prompt__body__options__button"
            indicator="arrowNext"
            weight="quiet"
            action="progressive"
            :lang="`zh-${variant}`"
            @click="$emit('select', `zh-${variant}`)"
          >
            {{ messages.variants[variant] }}
          </VAButton>
        </div>
        <p class="va-para va-para--subtle">
          {{ useI18n('vn.main.ext') }}
        </p>
      </div>
      <footer class="va-variant-prompt__footer" />
    </div>
  </Transition>
</template>

<style scoped lang="less">
@import (reference) '../styles/mixins.less';
@import (reference) '../styles/tokens.less';

.va-link {
  .link-base();
}

.va-title {
  border: 0; // Reset
  padding: 0; // Reset
  overflow-wrap: break-word;

  font-size: @font-size-xx-large;
  font-weight: @font-weight-bold;
  margin: @spacing-50 @spacing-0;
  color: @color-base;
}

.va-para {
  overflow-wrap: break-word;
  margin-top: @spacing-0;
  margin-bottom: @spacing-50;
  color: @color-base;

  &--subtle {
    color: @color-subtle;
    font-size: @font-size-x-small;
    margin-bottom: @spacing-35;
  }
}

.va-variant-prompt {
  box-sizing: border-box;
  z-index: @z-index-overlay;
  padding: @spacing-100 @spacing-150;
  position: fixed;
  left: 1.25em;
  bottom: 1em;
  width: calc(100% - $left * 2);
  max-width: 18em;
  max-height: calc(100vh - 2em);

  overflow: auto;
  overscroll-behavior: none;
  background-color: @background-color-base;
  border: @border-base;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow-drop-medium;
  font-family: @font-family-system-sans;
  font-size: 1rem; // Reset
  line-height: normal; // Reset

  &__close {
    padding: @spacing-shorthand-button-icon-only;
    float: right;
    margin-top: @spacing-50;
    margin-right: -(@spacing-horizontal-button-icon-only + 1px);
  }

  &__header {
    &__variant {
      color: @color-progressive;
    }
  }

  &__body {
    &__options {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: @spacing-75 @spacing-0;

      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;

      &__button {
        color: @color-base;
        background-color: @background-color-interactive-subtle;
        border-radius: 0;

        &:hover,
        &:active {
          border-color: @border-color-transparent;
        }
      }
    }
  }

  @media screen and (max-width: @max-width-breakpoint-mobile) {}
}

/* Notice transition effect */
.va-variant-prompt-enter-active,
.va-variant-prompt-leave-active {
  transition-property: @transition-property-fade, @transition-property-layout;
  transition-duration: @transition-duration-medium;
  transition-timing-function: @transition-timing-function-system;
}

.va-variant-prompt-enter-from,
.va-variant-prompt-leave-to {
  opacity: 0;
}
</style>
