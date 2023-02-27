<template>
  <SubPageLayout_32 
    :title="$t('tip.faceSearchFailed')"
    :style="{fontSize: '30px'}">
    <div class="search_failed_container">
      <div class="img_container">
        <div class="img_wrap">
          <img :src="face">
        </div>
      </div>
      <div class="item_wrap">
        <div class="item" 
          v-for="(item, index) in list" 
          :key="index"
          @click="turnTo(item.path)">
          <div class="img_wrap">
            <img :src="item.icon">
          </div>
          <p class="word">
            <LoopTextContainer>{{$t(item.label)}}</LoopTextContainer>
          </p>
        </div>
      </div>
    </div>
  </SubPageLayout_32>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import c1 from '../../../assets/images/32/c1.png'
import c2 from '../../../assets/images/32/c2.png'
import c3 from '../../../assets/images/32/c3.png'
import c4 from '../../../assets/images/32/c4.png'

import SubPageLayout_32 from '../../../components/layout/SubPageLayout_32.vue'

const face = ref('')
const store = useStore()
onMounted(() => {
  if(store.state.snapshotFace)
    face.value = 'data:image/jpg;base64,' + store.state.snapshotFace
})

const router = useRouter()
const turnTo = (path: string) => {
  router.push(path)
}
const list = [
  {
    label: 'subPage.scanCard.card',
    icon: c1,
    path: '/ScanCard/IDCard'
  },
  {
    label: 'subPage.scanCard.passport',
    icon: c2,
    path: '/ScanCard/Passport'
  },
  {
    label: 'subPage.scanCard.HMPass',
    icon: c3,
    path: '/ScanCard/HMPass'
  },
  {
    label: 'subPage.scanCard.boardingCheck',
    icon: c4,
    path: '/ScanCard/BoardingCheck'
  }
]
</script>
<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search_failed_container{
  height: 100%;
  .img_container{
      width: 336px;
      height: 380px;
      background-image: url('../../../assets/images/liu.png');
      background-size: cover;
      margin: 0 auto;
      padding-top: 105px;
    .img_wrap{
      width: 170px;
      height: 170px;
      border-radius: 85px;
      border: 2px solid #00DDC9;
      margin: 0 auto;
      padding: 3px;
      position: relative;
      overflow: hidden;
      img{
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
      }
    }
  }
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 40px;
    .item{
      width: 48%;
      height: 229px;
      background-color: #535F67;
      border-radius: 15px;
      margin-bottom: 4%;
      padding-top: 45px;
      .img_wrap{
        width: 94px;
        height: 94px;
        margin: 0 auto;
        img{
          width: 100%;
        }
      }
      .word{
        width: 400px;
        font-size: 43px;
        color: #fff;
        margin: 0 auto;
        margin-top: 15px;
      }
    }
  }
}
</style>