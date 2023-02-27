<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Layout from './components/layout/Layout.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getCurrentInstance, onMounted, onBeforeUnmount, computed } from 'vue'
import { createMsg } from './utils/message'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { setCookie } from './utils/cookies'
import Socket from './webSocket'

const { proxy } = getCurrentInstance() as any
const route = useRoute()
const router = useRouter()
const store = useStore()

onMounted(() => {
  // QCefView Version
  if(window.CallBridge){
    /**
     * C++ Call JavaScript
     */
    // 1、接收比对结果
    window.CallBridge.addEventListener('returnSearchResult', (scanType: string, val: any, img: string) => {
      recieveSearchResult(scanType, val, img)
    })
    // 2、接收设备固有属性
    window.CallBridge.addEventListener('returnDeviceProperties', (json: any) => {
      recieveProperties(json)
    })

    // 3、给机器人调用：切换多语言
    window.CallBridge.addEventListener('switchLang', (lang: string) => {
      switchLanguage(lang)
    })

    // 4、航显读卡器感知到开始读取证件时调用一次，页面开始显示loading
    window.CallBridge.addEventListener('beginScan', () => {
      console.log('Client call method: beginScan')
      store.commit('SET_CARD_SCANNING', true)
    })

    /**
     * JavaScript Call C++
     */
    // 告知客户端，默认语言为中文
    window.CallBridge.invokeMethod('switchLang', 'zh-CN')
  }

  /**
   * 10秒无操作，自动返回程序首页
   */
  autoBackHomePage()

  /**
   * 测试WebSocket连接，兼容新、老版本客户端软件
   * 频繁调用并创建ws实例会造成资源浪费，且会出现WebSocket opening handshake timed out报错
   */
  testConnectWS()
})

const { t, locale } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
  setCookie('lang', lang)
  store.commit('SET_LANG', lang)
}

const recieveProperties = (jsonString: any) => {
  console.log('device property json: ', jsonString)
  // 在使用 QCefView 框架后，C++传递过来的数据为JSON字符串，需要解析
  const json = JSON.parse(jsonString)
  const arr = json.homePath.split('/')
  const defaultPath = arr.length === 5 ? `/${arr[4]}` : `/${arr[4]}/55`
  const storeJson = { ...json, defaultPath }
  store.commit('SET_CONFIG', storeJson)
  if(json.dak) {
    let baseURL = ''
    if(process.env.NODE_ENV === 'development') {
      baseURL = '192.168.88.35'
    } else {
      baseURL = window.location.hostname
    }
    // 通过dak，调用接口获取设备的固有属性
    axios.get(`http://${baseURL}/recolinks/v1/device/fdisplays/dak/${json.dak}`).then((res: any) => {
      if(res.data.value) {
        const data = res.data.value
        const obj = { 
          floor: data.floor,
          terminal: data.terminal,
          scArea: data.scArea,
          x: data.x,
          y: data.y,
          rotation: data.rotation,
          deviceName: data.name    // 根据设备名，作为召唤机器人的点位
        }
        store.commit('SET_PROPERTIES', obj)
      }else {
        createMsg('warning', t('tip.searchNoDevice'), 'msg32')
      }
    }).catch(err => {
      createMsg('warning', t('tip.searchNoDevice'), 'msg32')
    })
  }
}

const recieveSearchResult = (scanType: string, v: any, img: string): void => {
  const val = JSON.parse(v)
  console.log("scanType: ", scanType)
  console.log("val: ", val)
  console.log("store.state.config:", store.state.config)
  // 刷脸结果
  if(scanType === 'camera') {
    // 将抓拍人脸图进行存储
    if(img) store.commit('SET_SNAPSHOT_FACE', img)
    if(val.code === 200 && val.value?.flightInfo) {
      // 跳转至比对成功页面
      router.push('/SearchSuccess')
      store.commit('SET_SEARCH_RESULT', val)
    }else {
      // 跳转至刷证找登机口页面
      router.push('/FaceSearchFailed')
      store.commit('SET_SEARCH_RESULT', {})
    }
    return
  }
  // 刷证结果
  if(scanType === 'card') {
    // 32寸设备
    if(!store.state.config.homePath.includes('/55')) {
      if(val.code === 200 && val.value?.flightInfo) {
        router.push(`/SearchSuccess`)
        store.commit('SET_SEARCH_RESULT', val)
      }else {
        router.push(`/CardSearchFailed`)
        store.commit('SET_SEARCH_RESULT', {})
      }
    } else {
      // 55寸设备
      if(val.code === 200 && val.value?.flightInfo) {
        router.push(`/CardSearchSuccess/55`)
        store.commit('SET_SEARCH_RESULT', val)
      }else {
        router.push(`/CardSearchFailed/55`)
        store.commit('SET_SEARCH_RESULT', {})
      }
    }
    // 将刷证页面控制loading显隐变量置为false
    store.commit('SET_CARD_SCANNING', false)
  }
}

/**
 * 超时自动返回首页
 */
const homePath = computed(() => {
  if(store.state.config.defaultPath)
    return store.state.config.defaultPath
  return route.path.split('/').indexOf('55') !== -1 ? '/CheckInHome/55' : '/InternalMixedAreaHome'
})

const autoBackHomePage = () => {
  let backHomeTimer: any = null
  const backToHome = () => {
    console.log('move...')
    backHomeTimer && clearInterval(backHomeTimer)
    backHomeTimer = setInterval(() => {
      if(store.state.busy) {
        backToHome()
      }else {
        console.log('go back home page')
        route.path !== homePath.value && router.push(homePath.value)
        // 判断如果此时是 "英文" 模式的话，返回首页时自动切换成 "中文"
        if(locale.value === 'EN') {
          switchLanguage('CN')
          if(window.CallBridge) {
            window.CallBridge.invokeMethod('switchLang', 'zh-CN')
          }
        }
      }
    }, config.returnHomeTimeout * 1000)
  }
  document.addEventListener('click', backToHome)
  document.addEventListener('touchstart', backToHome)
  document.addEventListener('input', backToHome)

  // 加载时就执行一次backToHome，以防当页面默认加载不是首页时，若不点击，则不会触发返回首页逻辑
  backToHome()
}

/**
 * 创建连接WebSocket实例
 */
const testConnectWS = () => {
  const cameraWS = new Socket(config.ws.camera, 'camera')
  const cameraBizWS = new Socket(config.ws.cameraBiz, 'cameraBiz')
  console.log('create camera ws instance...')
  store.commit('SET_CAMERA_WS', cameraWS)
  console.log('create cameraBiz ws instance...')
  store.commit('SET_CAMERA_BIZ_WS', cameraBizWS)
}

onBeforeUnmount(() => {
  store.state.cameraWS?.close()
  store.state.cameraBizWS?.close()
  store.commit('SET_CAMERA_WS', null)
  store.commit('SET_CAMERA_BIZ_WS', null)
})
</script>

<template>
  <Layout></Layout>
</template>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
  height: 100%;
  touch-action: none;
}
body, div, p, ul, ol, h1, h2, h3 {
  margin: 0;
  padding: 0;
  line-height: 1;
  box-sizing: border-box;
}
#app {
  height: 100%;
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
</style>
