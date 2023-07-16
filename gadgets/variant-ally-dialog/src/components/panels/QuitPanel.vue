<script setup lang="ts">
import { msg } from '../../msg';
</script>

<template>
  <div class="quit-panel">
    <h2>{{ msg('quit.heading') }}</h2>
    <p>{{ msg('quit.desc') }}</p>
  </div>
</template>

<style scoped lang="less">
@import (reference) '../../styles/mixins.less';
@import (reference) '../../styles/tokens.less';
</style>
