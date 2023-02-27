<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/3.png" alt="">
    </div>
    <p class="label">{{$t('subPage.airportMap.title')}}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  layout: {
    type: Object
  }
})
const router = useRouter()
const turnTo = () => {
  router.push('/AirportMap')
}
</script>

<style lang="scss" scoped>
</style>