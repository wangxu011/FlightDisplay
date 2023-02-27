<template>
  <SubPageLayout_55 :title="$t('subPage.scanCard.forCheckin')">
    <div class="scan_card_wrap">
      <div class="item_wrap">
        <div class="item" 
          v-for="(item, index) in list" 
          :key="index"
          @click="turnTo(item.path)">
          <div class="img_wrap">
            <img :src="item.icon">
          </div>
          <p class="word">{{$t(item.label)}}</p>
        </div>
      </div>
    </div>
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import SubPageLayout_55 from '../../components/layout/SubPageLayout_55.vue'

import { useRouter } from 'vue-router'

import c1 from '../../assets/images/32/c1.png'
import c2 from '../../assets/images/32/c2.png'
import c3 from '../../assets/images/32/c3.png'
import c4 from '../../assets/images/32/c4.png'

const router = useRouter()
const turnTo = (path: string) => {
  router.push(path)
}

const list = [
  {
    label: 'subPage.scanCard.card',
    icon: c1,
    path: '/ScanCard/IDCard/55'
  },
  {
    label: 'subPage.scanCard.passport',
    icon: c2,
    path: '/ScanCard/Passport/55'
  },
  {
    label: 'subPage.scanCard.HMPass',
    icon: c3,
    path: '/ScanCard/HMPass/55'
  },
  {
    label: 'subPage.scanCard.boardingCheck',
    icon: c4,
    path: '/ScanCard/BoardingCheck/55'
  }
]

</script>

<style lang="scss" scoped>
.scan_card_wrap{
  height: 100%;
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 37px 200px;
    .item{
      width: 48%;
      height: 360px;
      background-color: #535F67;
      border-radius: 15px;
      margin-bottom: 4%;
      padding-top: 60px;
      .img_wrap{
        width: 150px;
        height: 150px;
        margin: 0 auto;
        img{
          width: 100%;
        }
      }
      .word{
        font-size: 68px;
        color: #fff;
        margin-top: 15px;
      }
    }
  }
}
</style>