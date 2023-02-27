<template>
  <SubPageLayout_32 :title="$t('subPage.scanCard.title')">
    <div class="scan_card_wrap">
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
import { useRouter } from 'vue-router'

import c1 from '../../assets/images/32/c1.png'
import c2 from '../../assets/images/32/c2.png'
import c3 from '../../assets/images/32/c3.png'
import c4 from '../../assets/images/32/c4.png'

import SubPageLayout_32 from '../../components/layout/SubPageLayout_32.vue'

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
.scan_card_wrap{
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 37px;
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
        margin-top: 15px;
      }
    }
  }
}
</style>