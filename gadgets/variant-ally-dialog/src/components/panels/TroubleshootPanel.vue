<script setup lang="ts">
import { msg } from '../../msg';
import BackButton from '../buttons/BackButton.vue';

defineEmits(['main']);
</script>

<template>
  <div class="troubleshoot-panel">
    <div class="troubleshoot-panel__heading">
      <BackButton
        class="troubleshoot-panel__heading__back"
        @click="$emit('main')"
      />
      <h2>{{ msg('troubleshoot.heading') }}</h2>
    </div>
    <p>{{ msg('troubleshoot.desc.1') }}</p>
    <p>{{ msg('troubleshoot.desc.2') }}</p>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';

.troubleshoot-panel {
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
