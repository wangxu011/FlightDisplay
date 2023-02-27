<template>
  <Layout_32>
    <div class="middle_bg_wrap" v-if="!adExist">
      <div class="img_wrap">
        <img src="../../assets/images/32/welcome.png">
      </div>
    </div>
    <AdvertiseLoop @exist="dealExist" v-else></AdvertiseLoop>
    <!-- <p class="notice">
      <img src="../../assets/images/55/notice.png">
      <LoopTextContainer>
        <span class="word">
          {{$t('general.notice')}}
        </span>
      </LoopTextContainer>
    </p> -->
    <div class="btn_wrap">
      <!-- 根据设备朝向是否面向到达旅客，首个按钮为刷脸 / 机场出口 -->
      <ScanFace v-if="!ifArrived"></ScanFace>
      <AirportExit v-else></AirportExit>
      <FlightSchedule :layout="{marginLeft: '2%'}" v-if="!ifArrived"></FlightSchedule>
      <TrafficGuidance :layout="{marginLeft: '2%'}" v-else></TrafficGuidance>

      <AirportMap :layout="{marginTop: '2%'}"></AirportMap>
      <Food :layout="{marginTop: '2%', marginLeft: '2%'}"></Food>
      <Shopping :layout="{marginTop: '2%', marginLeft: '2%'}"></Shopping>
      <ConvenientService :layout="{marginTop: '2%'}"></ConvenientService>
      <TrafficGuidance :layout="{marginTop: '2%', marginLeft: '2%'}" v-if="!ifArrived"></TrafficGuidance>
      <TouristService :layout="{marginTop: '2%',marginLeft: '2%'}"></TouristService>
    </div>
    <div class="footer_wrap">
      <div class="left">
        <p class="line">
          <span>{{$t('general.hotline')}}：</span>
          <span>0571-96299</span>
        </p>
        <p class="line">
          <span>{{$t('general.copyright')}}</span>
          <span> &copy;2022 </span>
          <span>{{$t('general.xiaoshan')}}</span>
        </p>
      </div>
      <div class="right">
        <div class="code_wrap">
          <img src="../../assets/images/55/Code.png" />
        </div>
        <div class="word_wrap">
          <p class="word">{{$t('general.scanCode')}}</p>
        </div>
      </div>
    </div>
  </Layout_32>
</template>
<script lang="ts" setup>
import Layout_32 from '../../components/layout/Layout_32.vue'

import ScanFace from '../../components/homeModule/32/ScanFace.vue'
import AirportExit from '../../components/homeModule/32/AirportExit.vue'
import TouristService from '../../components/homeModule/32/TouristService.vue'
import AirportMap from '../../components/homeModule/32/AirportMap.vue'
import Food from '../../components/homeModule/32/Food.vue'
import Shopping from '../../components/homeModule/32/Shopping.vue'
import FlightSchedule from '../../components/homeModule/32/FlightSchedule.vue'
import TrafficGuidance from '../../components/homeModule/32/TrafficGuidance.vue'
import TransitGuidance from '../../components/homeModule/32/TransitGuidance.vue'
import ConvenientService from '../../components/homeModule/32/ConvenientService.vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const ifArrived = computed(() => store.state.config.IMAFaceArrived)

// 轮播广告是否存在，若不存在，则显示默认的静态图片
const adExist = ref(true)
const dealExist = (e: boolean) => {
  console.log('loop ad exist: ', e)
  adExist.value = e
}

</script>
<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.middle_bg_wrap{
  padding: 0 35px;
  .img_wrap{
    box-shadow: 2px -1px 13px 0px rgba(37, 38, 38, 0.7);
    border-radius: 20px;
    font-size: 0;
    img{
      width: 100%;
    }
  }
}
.notice{
  height: 33px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  margin-top: 20px;
  img{
    height: 28px;
    margin-right: 15px;
  }
  .word{
    font-size: 25px;
    color: #EC8001;
  }
}
.btn_wrap{
  display: flex;
  flex-wrap: wrap;
  padding: 20px 35px 0;
  div{
    height: 295px;
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 #eee;
    background-color: rgba(56, 64, 72, .8);
    border-bottom: 13px solid #00DDC9;
    line-height: 295px;
    color: #E2E6E7;
  }
}
.footer_wrap{
  width: 100%;
  position: absolute;
  height: 136px;
  bottom: 0;
  @include centerBox;
  padding: 0 35px;
  background-image: url('../../assets/images/32/footer.png');
  background-size: cover;
  .left{
    .line{
      font-size: 14px;
      margin-top: 10px;
      text-align: left;
      .privacy{
        text-decoration: underline;
      }
    }
  }
  .right{
    @include centerBox;
    .code_wrap{
      width: 80px;
      img{
        width: 100%;
      }
    }
    .word_wrap{
      font-size: 14px;
      color: #fff;
      text-align: left;
      margin-left: 20px;
      .word{
        line-height: 1.3em;
      }
    }
  }
}
</style>