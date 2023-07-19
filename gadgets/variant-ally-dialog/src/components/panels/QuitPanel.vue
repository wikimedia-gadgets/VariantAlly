<script setup lang="ts">
import { msg } from '../../msg';

defineProps<{
  titleId: string,
}>();
</script>

<template>
  <div class="quit-panel">
    <h2 :id="titleId">
      {{ msg('quit.heading') }}
    </h2>
    <p>{{ msg('quit.desc') }}</p>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';
</style>
