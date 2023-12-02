<script setup lang="ts">
import { ref, watch } from 'vue';
import { ValidVariant } from 'ext.gadget.VariantAlly';
import VAButton from './VAButton.vue';
import VAFadeTransition from './VAFadeTransition.vue';
import VASelect from './VASelect.vue';
import useI18n, { currentVariant, selectorDefault } from '../composables/useI18n';
import useUniqueId from '../composables/useUniqueId';
import useShuffledVariant from '../composables/useShuffledVariant';
import { VALID_VARIANTS } from '../constants';
import messages from '../../assets/messages.json';
import useModelWrapper from '../composables/useModelWrapper';

const props = withDefaults(defineProps<{
  open: boolean,
  disabled?: boolean,
  mobile?: boolean,
  autoClose?: boolean,
}>(), {
  disabled: false,
  mobile: false,
  autoClose: false,
});
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'update:disabled', value: boolean): void;
  (e: 'select', variant: ValidVariant): void;
  (e: 'optout'): void;
}>();

const prompt = ref<HTMLElement | null>(null);
const titleId = useUniqueId();
const descId = useUniqueId();
const shuffledVariant = useShuffledVariant();
const selectedVariant = ref(selectorDefault.value);
const isOpen = useModelWrapper(props, emit, 'open');
const isDisabled = useModelWrapper(props, emit, 'disabled');

function optOutAndClose() {
  emit('optout');
  isOpen.value = false;
}

function select(variant: ValidVariant) {
  isDisabled.value = true;
  emit('select', variant);
}

watch(prompt, () => {
  const element = prompt.value;
  if (element !== null) {
    element.addEventListener('mouseleave', (ev) => {
      // Do not dismiss if any button is pressed
      if (ev.buttons === 0 && props.autoClose && !props.disabled) {
        isOpen.value = false;
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
      :class="{ 'va-variant-prompt--mobile': mobile }"
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
        :disabled="disabled"
        @click="optOutAndClose"
      />
      <h2 class="va-variant-prompt__header va-title">
        {{ useI18n('vp.header') }}<br>
        <VAFadeTransition>
          <span
            :key="shuffledVariant"
            :lang="`zh-${shuffledVariant}`"
            class="va-variant-prompt__header__variant"
          >{{ messages.variants[shuffledVariant] }}</span>
        </VAFadeTransition>
      </h2>
      <p
        :id="titleId"
        class="va-variant-prompt__desc va-para"
      >
        {{ useI18n('vp.main') }}
      </p>
      <div class="va-variant-prompt__btn-group">
        <VAButton
          v-for="variant in VALID_VARIANTS"
          :key="variant"
          class="va-variant-prompt__btn-group__btn"
          indicator="arrowNext"
          weight="quiet"
          action="progressive"
          :lang="variant"
          :disabled="disabled"
          @click="() => { select(variant) }"
        >
          {{ messages.variants[variant] }}
        </VAButton>
      </div>
      <div class="va-variant-prompt__mobile">
        <VASelect
          v-model="selectedVariant"
          class="va-variant-prompt__mobile__select"
          :lang="selectedVariant"
          :disabled="disabled"
        >
          <option
            v-for="variant in VALID_VARIANTS"
            :key="variant"
            :value="variant"
            :lang="variant"
          >{{ messages.variants[variant] }}</option>
        </VASelect>
        <VAButton
          class="va-variant-prompt__mobile__action"
          action="progressive"
          icon="arrowNext"
          :disabled="disabled"
          @click="() => { select(selectedVariant) }"
        >{{ useI18n('vp.button') }}</VAButton>
      </div>
      <footer class="va-variant-prompt__footer">
        <p
          :id="descId"
          class="va-para va-para--subtle"
        >
          {{ useI18n('vp.main.ext') }}
        </p>
      </footer>
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
  margin-top: @spacing-50;
  margin-bottom: @spacing-50;
  color: @color-base;

  &--subtle {
    color: @color-subtle;
    font-size: @font-size-x-small;
    margin-bottom: @spacing-35;
  }
}

.va-variant-prompt {
  box-sizing: @box-sizing-base;
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

  &__btn-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: @spacing-75 @spacing-0;

    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;

    &__btn {
      color: @color-base;
      background-color: @background-color-interactive-subtle;
      border-radius: 0;

      &:hover,
      &:active {
        border-color: @border-color-transparent;
      }
    }
  }

  &__mobile {
    display: none;
  }
}

.va-variant-prompt--mobile {
  bottom: @spacing-0;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: @spacing-0;
  max-width: 600px;
  width: 100%;


  .va-variant-prompt {
    &__close {
      margin-top: @spacing-0;
    }

    &__desc {
      font-weight: @font-weight-bold;
    }

    &__header {
      display: none;
    }

    &__btn-group {
      display: none;
    }

    &__mobile {
      display: flex;

      &__select {
        margin-right: @spacing-75;
        flex: 1;
      }

      &__action {
        flex-shrink: 0;
      }
    }
  }
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
