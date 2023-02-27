<template>
  <SubPageLayout_32 :title="$t('subPage.airportExit.title')">
    <div class="airport_exit_wrap">
      <OpenLayer :exit="true"></OpenLayer>
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.airport_exit_wrap{
  height: 100%;
}
</style>