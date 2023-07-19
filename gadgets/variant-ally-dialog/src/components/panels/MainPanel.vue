<script setup lang="ts">
import { msg } from '../../msg';
import VariantButton from '../buttons/VariantButton.vue';

defineEmits<{
  (e: 'more' | 'troubleshoot'): void;
  (e: 'select', variant: string): void;
}>();

defineProps<{
  titleId: string,
  descId: string,
}>();
</script>

<template>
  <div class="main-panel">
    <h2
      :id="titleId"
      class="main-panel__title"
    >
      {{ msg('main.heading') }}
    </h2>
    <div class="main-panel__body">
      <p
        :id="descId"
        class="main-panel__body__desc"
      >
        {{ msg('main.desc') }}<a
          href="#"
          @click.prevent="$emit('more')"
        >{{ msg('main.desc.ext') }}</a>
      </p>
      <div class="main-panel__body__options">
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
    <footer class="main-panel__footer">
      <p>
        <!-- Disable link because it's unfinished -->
        {{ msg('main.footer') }}<!--<a
          href="#"
          @click.prevent="$emit('troubleshoot')"
        >{{ msg('main.footer.ext') }}</a>-->
      </p>
    </footer>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';

.main-panel {
  &__title {
    margin-right: -(@spacing-back-button + 1px);

    @media screen and (max-width: @max-width-breakpoint-mobile) {
      text-align: center;
      margin: @spacing-50 0;
      font-size: @font-size-x-large;
    }
  }

  &__body {
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
}</style>
