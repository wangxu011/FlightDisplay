<template>
  <div class="item2" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/12.png" alt="">
    </div>
    <p class="label">
      <LoopTextContainer>{{$t('subPage.scanFace.title')}}</LoopTextContainer>
    </p>
  </div>
</template>

<script lang="ts" setup>
import LoopTextContainer from '../../../components/LoopTextContainer.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  layout: {
    type: Object
  }
})
const router = useRouter()
const turnTo = () => {
  router.push('/ScanCard')
}
</script>

<style lang="scss" scoped>
</style>