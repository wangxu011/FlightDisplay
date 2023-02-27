<template>
  <Layout_55>
    <div class="checkin_home_container">
      <div class="top_wrap">
        <!-- <p class="notice">
          <img src="../../assets/images/55/notice.png">
          <LoopTextContainer>
            <span class="word">
              {{$t('general.notice')}}
            </span>
          </LoopTextContainer>
        </p> -->
        <div class="welcome_wrap" v-if="!adExist">
          <img src="../../assets/images/55/welcome.png">
        </div>
        <AdvertiseLoop55 @exist="dealExist" v-else></AdvertiseLoop55>
        <div class="btn_wrap">
          <TrafficGuidance />
          <FlightSchedule />
          <AirportMap />
          <Food />
          <Shopping />
          <FastSecurityCheck />
          <MoreService />
        </div>
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
          <!-- <p class="line">
            <span class="privacy">{{$t('general.privacy')}}</span>
          </p> -->
        </div>
        <div class="right">
          <div class="code_wrap">
            <img src="../../assets/images/55/Code.png">
          </div>
          <div class="word_wrap">
            <p class="word">{{$t('general.scanCode')}}</p>
          </div>
        </div>
      </div>
    </div>
  </Layout_55>
</template>
<script lang="ts" setup>
import Layout_55 from '../../components/layout/Layout_55.vue'

import TrafficGuidance from '../../components/homeModule/55/TrafficGuidance.vue'
import FlightSchedule from '../../components/homeModule/55/FlightSchedule.vue'
import AirportMap from '../../components/homeModule/55/AirportMap.vue'
import Food from '../../components/homeModule/55/Food.vue'
import Shopping from '../../components/homeModule/55/Shopping.vue'
import FastSecurityCheck from '../../components/homeModule/55/FastSC.vue'
import MoreService from '../../components/homeModule/55/MoreService.vue'

import { ref } from 'vue'
// 轮播广告是否存在，若不存在，则显示默认的静态图片
const adExist = ref(true)
const dealExist = (e) => {
  adExist.value = e
}
</script>
<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkin_home_container{
  height: 100%;
  position: relative;
  .top_wrap{
    padding: 100px 560px;
    .notice{
      height: 59px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      img{
        height: 48px;
        margin-right: 30px;
      }
      .word{
        font-size: 44px;
        margin-left: 20px;
        color: #FD7A10;
        font-weight: bold;
      }
    }
    .welcome_wrap{
      padding: 0 40px;
      margin-bottom: 40px;
      img{
        width: 100%;
        border-radius: 30px;
      }
    }
    .btn_wrap{
      padding: 0 40px;
      @include centerBox();
    }
  }
  .footer_wrap{
    width: 100%;
    position: absolute;
    height: 294px;
    bottom: 0;
    @include centerBox;
    padding: 0 200px;
    background-image: url('../../assets/images/55/footer.png');
    background-size: cover;
    .left{
      .line{
        font-size: 30px;
        margin-top: 25px;
        text-align: left;
        .privacy{
          text-decoration: underline;
        }
      }
    }
    .right{
      @include centerBox;
      .code_wrap{
        width: 150px;
        img{
          width: 100%;
        }
      }
      .word_wrap{
        font-size: 44px;
        color: #fff;
        text-align: left;
        margin-left: 20px;
        .word{
          line-height: 1.3em;
        }
      }
    }
  }
}
</style>