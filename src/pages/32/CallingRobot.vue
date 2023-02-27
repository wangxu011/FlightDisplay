<template>
  <Layout_32>
    <div class="calling_robot_container">
      <div class="inner_wrap">
        <div class="top_wrap">
          <div class="tip_wrap">
            <div class="img_wrap">
              <img src="../../assets/images/robot/icon1.png">
            </div>
            <div class="tip" v-if="ratio!==100">
              {{$t('general.callingRobot', { robotName: $t('general.robotName')})}}
            </div>
            <div class="tip" v-else>
              {{$t('general.robotArrived', { robotName: $t('general.robotName')})}}
            </div>
          </div>
          <div class="progress_wrap">
            <div class="inner_progress" :style="{width: ratio*783*0.01 + 'px'}">
              {{ratio}}%
            </div>
            <div class="robot_wrap" :style="{left: ratio ? ratio*783*0.01 + 'px' : '15px'}">
              <img src="../../assets/images/robot/icon2.png">
            </div>
          </div>
        </div>
        <div class="tab_btn_wrap">
          <div class="btn" @click="switchTab('location')">
            <div class="img_wrap" :class="{'selected':activeTab === 'location'}">
              <img src="../../assets/images/robot/location.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.realTimePosition')}}</LoopTextContainer>
            </p>
          </div>
          <div class="img_wrap">
            <img src="../../assets/images/robot/switch.png">
          </div>
          <div class="btn" @click="switchTab('instruction')">
            <div class="img_wrap" :class="{'selected':activeTab === 'instruction'}">
              <img src="../../assets/images/robot/book.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.useGuide')}}</LoopTextContainer>
            </p>
          </div>
        </div>
        <div class="content_wrap">
          <div class="map_wrap" v-if="activeTab==='location'">
            <LeafletMap :planRoute="planRoute" :remainingTime="remainingTime"></LeafletMap>
          </div>
          <div class="instruction_wrap" v-else :class="{'en':getCookie('lang')==='EN'}"></div>
        </div>
      </div>
    </div>
  </Layout_32>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getCookie } from '../../utils/cookies'

import LeafletMap from '../../components/LeafletMap.vue'
import { ElLoading } from 'element-plus'

import { _getRobotByCode, _getCallResult } from '../../axios/api/robotController'
import { createMsg } from '../../utils/message'

const { t } = useI18n()


/* 实时进度条相关变量 */
const initialRemainingMile = ref(0) // 初次获取到剩余里程数，作为总里程
const realTimeRemainingMile = ref(0) // 定时器获取到的剩余里程数

// 规划路径坐标字符串
const planRoute = ref('')
// 到达召唤地点的剩余时间
const remainingTime = ref(0)

// 召唤机器人过来的进度
const ratio = computed(() => {
  if(initialRemainingMile.value === 0)
    return 0
  // 处理召唤进度出现负数的情况
  if(initialRemainingMile.value < realTimeRemainingMile.value)
    return 0
  return Math.round(100 * (initialRemainingMile.value - realTimeRemainingMile.value) / initialRemainingMile.value)
})

// "实时位置" / "使用说明" Tab切换变量
const activeTab = ref('location')
const switchTab = (tab: string) => {
  activeTab.value = tab
}

const route = useRoute()
const router = useRouter()

let callResultTimer: NodeJS.Timer | null = null

onMounted(async () => {
  getInitialMile()
  // 从路由参数中拿到 "召唤任务ID" ，实时获取此次召唤任务的状态，并对异常状态进行处理
  callResultTimer = setInterval(() => {
    dealCallStatus()
  }, 1000)
})

const dealCallStatus = () => {
  if(String(route.query.callId)) {
    _getCallResult(String(route.query.callId)).then(res => {
      console.log('call result: ', res)
      // res.value.status => 0: running, 1: success, 2: failed, 3: cancel
      if(res.code === 200) {
        if(res.value.status === 2 || res.value.status === 3) {
          const msg = res.value.status === 2 ? '召唤失败' : '召唤已取消'
          createMsg('warning', msg, 'msg32')
          store.commit('SET_BUSY', false)
          router.go(-1)
        }else if(res.value.status === 1) {
          callResultTimer && clearInterval(callResultTimer)
          // 召唤结束，到达终点，将路径、时间全部置空
          store.commit('SET_BUSY', false)
          planRoute.value = ''
          remainingTime.value = 0
          realTimeRemainingMile.value = 0
          getRemainingMileTimer && clearInterval(getRemainingMileTimer)
        }
      }
    })
  }
}

// 获取初始剩余里程数，如果第一次获取到的数字为0，则持续获取，直到不为0
const getInitialMile = () => {
  const loading = ElLoading.service({
    lock: true,
    text: t('general.calculate'),
    background: 'rgba(10, 10, 10, .5)',
    customClass: 'call_robot_32'
  })
  let initialTimer: NodeJS.Timer | null = null
  // 定时器循环次数，如果超过10次获取到的剩余距离还是 <3，那么走正常流程
  let loopTime: number = 0
  if(route.query.robotCode) {
    initialTimer = setInterval(async () => {
      loopTime ++
      try {
        const res = await _getRobotByCode(String(route.query.robotCode))
        if(res.value) {
          if(res.value.remainingMile >= 3 || loopTime >= 10) {
            loading.close()
            initialRemainingMile.value = res.value.remainingMile
            realTimeRemainingMile.value = res.value.remainingMile
            console.log('初始里程数：', initialRemainingMile.value)
            // 开启正常的定时轮询
            getRemainingMile()
            initialTimer && clearInterval(initialTimer)
          }
        }
      }catch (err: any) {
        createMsg('warning', err.message, 'msg32')
        initialTimer && clearInterval(initialTimer)
        loading.close()
      }
    }, 1000)
  }
}

let getRemainingMileTimer: NodeJS.Timer | null = null
const store = useStore()
const getRemainingMile = () => {
  console.log('begin loop...')
  store.commit('SET_BUSY', true)
  getRemainingMileTimer = setInterval(async () => {
    if(route.query.robotCode) {
      try {
        const res = await _getRobotByCode(String(route.query.robotCode))
        if(res.value) {
          realTimeRemainingMile.value = res.value.remainingMile  // 剩余里程
          planRoute.value = res.value.planRoute                  // 剩余规划路径集合
          remainingTime.value = res.value.remainingTime          // 剩余到达时间
        }
      }catch (err) {
        console.log(err)
        getRemainingMileTimer && clearInterval(getRemainingMileTimer)
      }
    }
  }, 1000)
}

onBeforeUnmount(() => {
  callResultTimer && clearInterval(callResultTimer)
})

</script>

<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calling_robot_container{
  height: 100%;
  padding: 0 35px 35px;
  .inner_wrap{
    height: 100%;
    box-shadow: -1px 7px 13px 0px rgb(37 38 38 / 70%);
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    padding: 35px;
    .top_wrap{
      height: 300px;   
      box-shadow: -1px 7px 13px 0px rgba(37, 38, 38, 0.7);
      border-radius: 15px;
      background-color: #fff;
      .tip_wrap{
        display: flex;
        align-items: center;
        padding: 0 115px;
        padding-top: 37px;
        .img_wrap{
          height: 126px;
          img{
            height: 100%;
          }
        }
        .tip{
          font-size: 32px;
          margin-left: 46px;
          text-align: left;
          line-height: 1.3em;
        }
      }
      .progress_wrap{
        width: 783px;
        height: 32px;
        background-color: #E2E2E2;
        border-radius: 10px;
        position: relative;
        margin: 0 auto;
        margin-top: 50px;
        .inner_progress{
          height: 32px;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #5EF4FE;
          border-radius: 10px;
          line-height: 30px;
          font-size: 23px;
          text-align: right;
          padding-right: 15px;
        }
        .robot_wrap{
          height: 59px;
          position: absolute;
          bottom: 0;
          left: 15px;
          img{
            height: 100%;
          }
        }
      }
    }
    .tab_btn_wrap{
      @include centerBox;
      padding: 46px 52px;
      .btn{
        width: 295px;
        height: 125px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #384048;
        border-radius: 15px;
        padding: 21px 35px;
        border: 2px solid #38F4FF;
        box-shadow: 0px 2px 24px 0px rgba(15, 34, 83, 0.47);
        .img_wrap{
          width: 80px;
          height: 80px;
          border-radius: 40px;
          border: 1px solid #fff;
          position: relative;
          background-color: #DBDBDB;
          img{
            height: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .selected{
          background-color: #FFDE00;
        }
        .line{
          width: 0;
          height: 35px;
          border-left: 1px solid #00DDC9;
          margin-left: 35px;
          margin-right: 25px;
        }
        .name{
          width: 90px;
          font-size: 35px;
          color: #fff;
        }
        .active{
          color: #FFDE00;
        }
      }
    }
    .content_wrap{
      height: calc(100% - 517px);
      .map_wrap{
        height: 100%;
      }
      .instruction_wrap{
        height: 100%;
        background: #fff url(../../assets/images/robot/instruction_cn.png) no-repeat center;
        border-radius: 15px;
        box-shadow: -1px 9px 8px 0px rgba(83, 95, 103, 0.28);
      }
      // 对应的英文的图片
      .en{
        background: #fff url(../../assets/images/robot/instruction_en.png) no-repeat center;
      }
    }
  }
}
</style>