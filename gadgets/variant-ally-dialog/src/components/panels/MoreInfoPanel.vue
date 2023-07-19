<script setup lang="ts">
import { msg } from '../../msg';
import BackButton from '../buttons/BackButton.vue';

defineEmits(['main']);

defineProps<{
  titleId: string,
  descId: string,
}>();
</script>

<template>
  <div class="more-panel">
    <header class="more-panel__heading">
      <BackButton
        class="more-panel__heading__back"
        @click="$emit('main')"
      />
      <h2 :id="titleId">
        {{ msg('more.heading') }}
      </h2>
    </header>
    <div class="more-panel__body">
      <div
        :id="descId"
        class="more-panel__body__desc"
      >
        <p>{{ msg('more.desc.1') }}</p>
        <p>{{ msg('more.desc.2') }}</p>
        <p>{{ msg('more.desc.3') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';

.more-panel {
  &__heading {
    display: flex;
    align-items: center;

    &__back {
      margin-right: @spacing-30;
      margin-left: -(@spacing-back-button + 1px);
    }
  }
}
</style>
