<template>
  <div class="layout_wrapper" :style="{'fontFamily': font}">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const font = computed(() => {
  return locale.value === 'CN' ? '华康黑体W5-A' : 'Univers'
})
</script>

<style lang="scss">
.layout_wrapper{
  width: 100%;
  height: 100%;
}
</style>