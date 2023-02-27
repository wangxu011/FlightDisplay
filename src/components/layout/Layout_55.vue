<template>
  <div class="home_container_55">
    <div class="header_wrap">
      <div class="logo_wrap">
        <img src="../../assets/images/svg-logo.svg">
      </div>
      <div class="right_part">
        <div class="date_wrap">
          <p class="time">{{data.time}}</p>
          <p class="date">
            <span>{{data.date}}</span>
            <span :style="{marginLeft:'20px'}">{{$t(data.day)}}</span>
          </p>
        </div>
        <div class="lang_wrap" @click="switchLang" v-if="if55Home">
          <div class="icon_wrap">
            <img src="../../assets/images/55/lang.png">
          </div>
          <p class="word">
            <span :style="{color: currentLang==='CN'?'#00ddc9':'#fff'}">中文</span>
            <span> / </span>
            <span :style="{color: currentLang==='EN'?'#00ddc9':'#fff'}">English</span>
          </p>
        </div>
        <div class="back_wrap" @click="goHome" v-else>
          <el-icon :size="50" color="#fff">
            <home-filled />
          </el-icon>
          <span class="word">{{$t('general.home')}}</span>
        </div>
      </div>
    </div>
    <div class="content_wrap">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatToday } from '../../utils/timeFormatter'
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { setCookie } from '../../utils/cookies'

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

const { locale } = useI18n()
const store = useStore()

const switchLang = () => {
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

const router = useRouter()
const route = useRoute()

const homeList: string[] = ['/CheckInHome/55', '/TrafficCenterHome/55']

// 计算属性：当前页面是否为55寸设备首页
const if55Home =  computed(() => {
  return homeList.indexOf(route.path) != -1
})
// 返回首页
const goHome = () => {
  router.push({
    path: store.state.config.defaultPath || '/CheckInHome/55'
  })
}
</script>

<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.home_container_55{
  height: 100%;
  background-image: url('../../assets/images/55/new.png');
  background-size: cover;
  position: relative;
  .header_wrap{
    height: 274px;
    border-bottom: 10px solid #333;
    background-color: #00ddc9;
    border-bottom-left-radius: 70px;
    border-bottom-right-radius: 70px;
    @include centerBox;
    padding: 0 200px;
    .logo_wrap{
      width: 926px;
      img{
        width: 100%;
      }
    }
    .right_part{
      @include centerBox;
      .date_wrap{
        min-width: 290px;
        .time{
          text-align: right;
          font-size: 60px;
          font-weight: bold;
          font-family: 'Univers';
        }
        .date{
          text-align: right;
          font-size: 30px;
          margin-top: 10px;
          font-family: 'Univers';
        }
      }
      .lang_wrap{
        width: 352px;
        @include centerBox;
        background-color: #384048;
        border-radius: 45px;
        margin-left: 90px;
        font-size: 36px;
        padding: 0 30px;
        .icon_wrap{
          img{
            width: 50px;
          }
        }
        .word{
          line-height: 90px;
          color: #fff;
          margin-left: 10px;
          font-family: 'Univers';
        }
      }
      .back_wrap{
        @include centerBox;
        background-color: #384048;
        border-radius: 45px;
        margin-left: 90px;
        font-size: 36px;
        padding: 0 40px;
        .word{
          line-height: 90px;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
  }
  .content_wrap{
    height: calc(100% - 274px);
  }
}
</style>