<template>
  <div class="home_wrap">
    <Cesium></Cesium>
    <!-- <p>HOME</p>
    <button class="btn" @click="testQTMethod">测试QT</button>
    <div class="half"></div>
    <div>{{$t('test.content')}}</div> -->
  </div>
</template>

<script lang="ts" setup>
// Cesium
import Cesium from '../components/Cesium.vue'

import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import { formatTimeStamp } from '../utils/timeFormatter'

import Channel from '../qt/Channel'

let qtWebChannel: any = null

onMounted(() => {
  // 初始化QtWebChannel
  qtWebChannel = new Channel()

  // test timeFormat
  const stamp = 151212121121
  console.log('result: ', formatTimeStamp(stamp))
})

const testQTMethod = () => {
  qtWebChannel.QTObject.searchFlightByCamera()
}

const store = useStore()

const count = computed(() => (
  store.state.count
))

const add = () => {
  store.commit('add')
}
</script>

<style lang="scss">
$red: '#f00';
.home_wrap{
  height: 100%;
  color: red;
  text-align: left;
  .half{
    width: 512px;
    border: 1px solid red;
  }
}
</style>