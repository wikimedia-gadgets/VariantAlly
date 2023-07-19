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
  <div class="quit-panel">
    <header class="quit-panel__heading">
      <BackButton
        class="quit-panel__heading__back"
        @click="$emit('main')"
      />
      <h2 :id="titleId">
        {{ msg('quit.heading') }}
      </h2>
    </header>
    <p :id="descId">
      {{ msg('quit.desc') }}
    </p>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';

.quit-panel {
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
