<template>
  <div class="loop_wrap">
    <el-carousel trigger="click" height="700px" :interval="8000" 
      arrow="always" v-if="adList.length">
      <el-carousel-item v-for="item in adList" :key="item.id">
        <div class="img_wrap">
          <img :src="'data:image/png;base64,' + item.img" v-if="item.img" />
          <img v-else src="../../assets/images/55/welcome.png" />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'

import { _getAdvertiseList, _getAdvertiseDetail } from '../../axios/api/categoryController'

onMounted(() => {
  getADList()
})

type ADItem = {
  id: string,
  img: string
}

// 获取到的广告是否存在
const emit = defineEmits(['exist'])

// 获取首页公告列表
const adList = ref<ADItem[]>([])
const getADList = () => {
  _getAdvertiseList('FLIGHT_DISPLAY_55').then(res => {
    if(res.value.length > 0) {
      emit('exist', true)
      let tempArr: ADItem[] = []
      res.value.forEach(ad => {
        const item: ADItem = {
          id: ad.id,
          img: ''
        }
        tempArr.push(item)
        _getAdvertiseDetail(ad.id).then(res => {
          item.img = res.value.pic
          nextTick(() => {
            adList.value = []
            adList.value = tempArr
          })
        }) 
      })
    }else {
      emit('exist', false)
    }
  }).catch(err => {
    emit('exist', false)
  })
}
</script>

<style lang="scss" scoped>
.loop_wrap{
  padding: 0 40px;
  margin-bottom: 40px;
  .el-carousel__item{
    .img_wrap{
      height: 100%;
      display: flex;
      justify-content: center;
      overflow: hidden;
      border-radius: 20px;
      img{
        height: 100%;
      }
    }
  }
}
</style>