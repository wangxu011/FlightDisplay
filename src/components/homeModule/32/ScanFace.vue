<template>
  <div class="item2" @click="turnTo">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/9.png" alt="">
    </div>
    <p class="label">
      <LoopTextContainer>{{$t('subPage.scanFace.title')}}</LoopTextContainer>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import LoopTextContainer from '../../../components/LoopTextContainer.vue'

const router = useRouter()
const store = useStore()
const turnTo = () => {
  const connectWSRes = store.state.cameraWS?.isConnected() ?? false
  console.log('ws connect res: ', connectWSRes)
  // 若连接webSocket成功，则为新版本航显客户端
  if(connectWSRes) {
    router.push('/ScanFace')
  }else {
    // 再尝试连接一次ws，防止ws中途掉线后又重新连接
    store.state.cameraWS?.connect()
    store.state.cameraBizWS?.connect()
    window.CallBridge && window.CallBridge.invokeMethod('searchFlightByCamera')
  }
}
</script>

<style lang="scss" scoped>
</style>