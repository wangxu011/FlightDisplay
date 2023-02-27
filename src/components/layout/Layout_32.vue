<template>
  <div class="home_container_32">
    <div class="header_wrap">
      <div class="logo" v-if="if32Home">
        <img src="../../assets/images/svg-logo.svg">
      </div>
      <div class="back_wrap" @click="back" v-if="(!if32Home && !ifCallingRobot) || (ifCallingRobot && !store.state.busy)">
        <el-icon :size="45" color="#384048">
          <arrow-left />
        </el-icon>
        <span class="word">{{$t('general.back')}}</span>
      </div>
      <!-- 取消召唤 -->
      <div class="back_wrap" @click="cancelCall" v-if="ifCallingRobot && store.state.busy">
        <el-icon :size="45" color="#384048">
          <arrow-left />
        </el-icon>
        <span class="word">{{$t('general.cancelCall')}}</span>
      </div>
      <div class="right_wrap" v-if="if32Home">
        <div class="date_wrap">
          <p class="time">{{data.time}}</p>
          <p class="date">
            <span>{{data.date}}</span>
            <span :style="{marginLeft:'10px'}">{{$t(data.day)}}</span>
          </p>
        </div>
        <div class="divide_line"></div>
        <div class="word" @click="switchLanguage">
          <span :style="{color: currentLang === 'CN' ? '#545555' : '#ddd'}">中</span>
          <span :style="{margin: '0 5px', color: '#ddd'}">/</span>
          <span :style="{color: currentLang==='EN' ? '#545555' : '#ddd'}">EN</span>
        </div>
      </div>
      <div class="home_wrap"  @click="goHome" v-if="!if32Home && !ifCallingRobot">
        <el-icon :size="45" color="#384048">
          <home-filled />
        </el-icon>
        <span class="word">{{$t('general.home')}}</span>
      </div>
    </div>
    <!-- 不同位置的航显首页对应不同的内容 -->
    <div class="content_wrap">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { formatToday } from '../../utils/timeFormatter'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { setCookie } from '../../utils/cookies'

import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

import { _robotControl } from '../../axios/api/robotController'
import { createMsg } from '../../utils/message'

let timer: any = null
const data = reactive({
  time: '',
  date: '',
  day: '' 
})
onMounted(() => {
  const res = formatToday()
  data.time = res[0]
  data.date = res[1]
  data.day = res[2]
  timer = setInterval(() => {
    const res = formatToday()
    data.time = res[0]
    data.date = res[1]
    data.day = res[2]
  }, 60000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const { locale, t } = useI18n()
const store = useStore()
const switchLanguage = () => {
  if(!store.state.lang || store.state.lang === 'CN') {
    locale.value = 'EN'
    setCookie('lang', 'EN')
    store.commit('SET_LANG', 'EN')
    if(window.CallBridge) {
      window.CallBridge.invokeMethod('switchLang', 'en-US')
    }
  }else {
    locale.value = 'CN'
    setCookie('lang', 'CN')
    store.commit('SET_LANG', 'CN')
    if(window.CallBridge) {
      window.CallBridge.invokeMethod('switchLang', 'zh-CN')
    }
  }
}
const currentLang = computed(() => {
  return locale.value
})

const currentRoute = computed(() => {
  return route.path
})

const router = useRouter()
const route = useRoute()

const back = () => {
  router.go(-1)
}

const goHome = () => {
  router.push({
    path: store.state.config.defaultPath || '/InternalMixedAreaHome'
  })
}

// 取消召唤机器人
const cancelCall = () => {
  ElMessageBox({
    title: t('tip.prompt'),
    message: t('general.ifCancelCalling', { robotName: t('general.robotName') }),
    type: 'warning',
    showClose: false,
    showCancelButton: true,
    cancelButtonText: t('general.cancelCall'),
    confirmButtonText: t('general.resumeWait'),
    customClass: 'my-msg-box',
    confirmButtonClass: 'my-confirm-box',
    cancelButtonClass: 'my-cancel-box'
  }).catch((action: Action) => {
    // 调用取消召唤接口，并返回上一页
    const obj: object = {
      code: route.query.robotCode,
      command: 'cancel_call'
    }
    _robotControl(obj).then(res => {
      createMsg('success', t('general.cancelSuccess'), 'msg32')
    }).catch(err => {
      createMsg('error', t('general.cancelFailed'), 'msg32')
    }).finally(() => {
      store.commit('SET_BUSY', false)
      router.go(-1)
    })
  })
}

const homeList: string[] = ['/InternalMixedAreaHome', '/VIPHome', '/InternationalDepartureHome']

// 计算属性：当前页面是否为32寸设备首页
const if32Home =  computed(() => {
  return homeList.indexOf(route.path) != -1
})

// 是否为 “召唤机器人页面”
const ifCallingRobot = computed(() => {
  return route.path === '/CallingRobot'
})
</script>
<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.home_container_32{
  height: 100%;
  background-image: url('../../assets/images/32/bg_img.png');
  background-size: cover;
  .header_wrap{
    height: 140px;
    @include centerBox;
    padding: 38px 35px;
    background-color: #00DDC9;
    border-radius: 0 0 30px 30px;
    border-bottom: 5px solid #333;
    .logo{
      img{
        height: 57px;
      }
    }
    .back_wrap{
      display: flex;
      align-items: center;
      .word{
        font-size: 30px;
        font-weight: bold;
        color: #384048;
      }
    }
    .right_wrap{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .date_wrap{
        min-width: 156px;
        .time{
          text-align: right;
          font-size: 37px;
          font-weight: bold;
          font-family: 'Univers';
        }
        .date{
          font-size: 17px;
          margin-top: 5px;
          font-family: 'Univers';
        }
      }
      .divide_line{
        width: 0;
        height: 26px;
        border-left: 2px solid #545555;
        margin: 0 20px;
      }
      .word{
        width: 92px;
        font-size: 28px;
        font-weight: bold;
      }
    }
    .home_wrap{
      display: flex;
      align-items: center;
      .word{
        font-size: 30px;
        font-weight: bold;
        color: #384048;
        margin-left: 5px;
      }
    }
  }
  .btn_wrap{
    @include centerBox;
    padding: 25px 35px 25px;
    .lang_wrap{
      @include centerBox;
      background-color: #384048;
      border-radius: 23px;
      font-size: 17px;
      padding: 0 10px;
      .icon_wrap{
        img{
          width: 29px;
        }
      }
      .word{
        line-height: 46px;
        color: #fff;
        margin-left: 10px;
      }
    }
    .back_wrap, .home_wrap{
      @include centerBox;
      background-color: #384048;
      border-radius: 23px;
      font-size: 23px;
      color: #00F4DE;
      padding: 0 20px;
      span{
        line-height: 46px;
      }
    }
  }
  .content_wrap{
    // 本来高度应该是（100% - 175px）
    // 但是在QT中显示会出现纵向滚动条
    height: calc(100% - 176px);
    position: relative;
    margin-top: 35px;
  }
}
</style>