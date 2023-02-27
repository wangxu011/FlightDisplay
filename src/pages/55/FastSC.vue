<template>
  <SubPageLayout_55 :title="$t('subPage.intelligentSC.title')">
    <div class="fast_sc_wrap" :class="{'en': locale === 'EN'}">
      <div class="top_wrap" v-if="averageTime">
        <div class="img_wrap">
          <img src="../../assets/images/55/person.png" alt="">
        </div>
        <div class="min_wrap">
          <p class="min">
            <span class="big">{{averageTime}}</span>
            <span class="small">{{$t('general.min')}}</span>
          </p>
          <p class="text">{{$t('general.scTime')}}</p>
        </div>
      </div>
      <div class="update_time_wrap" v-if="averageTime">
        <p class="text">{{$t('general.updateTime')}}</p>
        <p class="time">{{formatTimeStamp(new Date().getTime())}}</p>
      </div>
    </div>  
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { _queryFastSC } from '../../axios/api/fastSCController'

import { formatTimeStamp } from '../../utils/timeFormatter'

const { locale } = useI18n()

// 安检平均排队时间
const averageTime = ref('')

onMounted(() => {
  // 原接口已移除，后面直接调用机场提供的接口
  // _queryFastSC().then(res => {
  //   console.log(res)
  //   if(res.value.length) {
  //     let queueLength = 0
  //     res.value.forEach(item => {
  //       queueLength += item.queueLength
  //     })
  //     // 排队时间 = 队长 * 1.5
  //     const avgTime = Math.round((queueLength * 1.5) / res.value.length)
  //     averageTime.value = avgTime < 10 ? '0' + avgTime : '' + avgTime
  //   }
  // })
})
</script>

<style lang="scss" scoped>
.fast_sc_wrap{
  width: 2573px;
  height: 1351px;
  box-shadow: -2px 14px 26px 0px rgb(37 38 38 / 70%);
  border-radius: 30px;
  background: #f1f4f8;
  position: relative;
  background-image: url('../../assets/images/55/sc_cn.png');
  background-size: 100% 100%;
  margin: 0 auto;
  .top_wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 160px;
    left: 1057px;
    .min_wrap{
      color: #FFC700;
      margin-left: 50px;
      .min{
        text-align: left;
        .big{
          font-size: 170px;
          font-weight: bold;
          font-family: 'Univers';
        }
        .small{
          font-size: 50px;
        }
      }
      .text{
        font-size: 50px;
        color: #fff;
        margin-top: 16px;
      }
    }
  }
  .update_time_wrap {
    position: absolute;
    bottom: 130px;
    right: 200px;
    color: #fff;
    .text{
      font-size: 24px;
      text-align: left;
    }
    .time{
      font-size: 30px;
      text-align: left;
      margin-top: 10px; 
    }
  }
}
.en{
  background-image: url('../../assets/images/55/sc_en.png');
}
</style>