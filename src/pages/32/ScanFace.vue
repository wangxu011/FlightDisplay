<template>
  <SubPageLayout_32 :title="$t('subPage.scanFace.title')">
    <div class="scan_face_wrap">
      <div class="video_wrap">
        <div class="socket_img_wrap">
          <img class="socket_img" :src="wsImg" />
        </div>
        <p class="tip">{{$t('tip.takeOffMask')}}</p>
      </div>
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { _searchByFace } from '../../axios/api/flightController'

// webSocket传过来的图片
const wsImg = ref('')

const router = useRouter()
const store = useStore()
const { t } = useI18n()

onMounted(() => {
  // 播放提示音
  if(window.CallBridge) {
    window.CallBridge.invokeMethod('playSound', t('tip.takeOffMaskSound'))
  }
  // 连接WebSocket，获取抓拍相机实时视频
  linkCamera()
  // 连接WebSocket，连接与摄像头程序之间的业务逻辑通信
  linkCameraBiz()
})

// Camera/Video
const linkCamera = () => {
  // 订阅实时抓拍视频流
  store.state.cameraWS?.subscribe('faceCapture', dealCameraImg)
}
const dealCameraImg = (data) => {
  wsImg.value = data.data
}

// Camera/Control
const linkCameraBiz = () => {
  // 1、先重置一次人脸上报，以防一进来时就有人脸导致不抓拍
  store.state.cameraBizWS?.send({'Service': 'SetFaceCapture', 'Body': { 'status': 2 }})
  // 2、订阅人脸上报
  store.state.cameraBizWS?.subscribe('ActiveReportPerson', dealCaptureFace)
}
// 将抓拍得到的人脸去做1：N比对
const dealCaptureFace = (data) => {
  if(data.PersonTraceInfoList.length) {
    const faceRes = data.PersonTraceInfoList[0]
    // 将抓拍人脸图进行存储
    store.commit('SET_SNAPSHOT_FACE', faceRes.FaceImage)
    // 调用1：N接口
    _searchByFace(faceRes.FaceImage).then(res => {
      console.log('res: ', res)
      // code === 200，比中，将结果存入store
      if(res.code === 200) {
        router.push('/SearchSuccess')
        store.commit('SET_SEARCH_RESULT', res)
      }else {
        router.push('/FaceSearchFailed')
        store.commit('SET_SEARCH_RESULT', {})
      }
    }).catch(err => {
      // 调用航信比对接口出错，也看作比对失败，跳转至 ‘未比中’ 页面
      router.push('/FaceSearchFailed')
      store.commit('SET_SEARCH_RESULT', {})
    })
  }
}

onBeforeUnmount(() => {
  store.state.cameraWS?.unsubscribe('faceCapture')
  store.state.cameraBizWS?.unsubscribe('ActiveReportPerson')
})
</script>

<style lang="scss" scoped>
.scan_face_wrap{
  height: 100%;
  .video_wrap{
    width: 811px;
    height: 929px;
    position: relative;
    margin: 0 auto;
    margin-top: 50px;
    background-image: url('../../assets/images/32/scan_face.png');
    padding-top: 248px;
    .socket_img_wrap{
      width: 600px;
      height: 340px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
      .socket_img{
        position: absolute;
        width: 100%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .tip{
      font-size: 70px;
      font-weight: bold;
      margin-top: 36px;
    }
  }
}
</style>