import { createStore } from 'vuex'

import { getCookie, setCookie } from '../utils/cookies'
import Socket from '../webSocket'

const store = createStore({
  state() {
    return {
      lang: getCookie('lang'),
      searchResult: {},     // 刷脸 / 刷证 / 护照返回的人员信息
      config: {},           // 在Client端进行的配置，包括：dak，设备尺寸，默认路由页，是否面向到达旅客，航显所在点位在激光地图中点位的code
      innateProperties: {}, // 设备固有属性：通过dak调用接口获取，包括：floor，terminal，scArea, x, y, rotation, deviceName
      snapshotFace: '',     // 32寸设备抓拍的现场图
      cardScanning: false,  // 设备侧是否检测到开始刷证（用以控制显示loading效果）
      busy: false,          // 表示当前航显是否繁忙，用于控制是否自动返回首页，用的地方有：召唤机器人过程中，使用地图模拟导航时
      cameraWS: null,       // 连接相机回显程序的webSocket实例
      cameraBizWS: null     // 与相机程序交互的webSocket实例
    }
  },
  mutations: {
    SET_LANG(state: any, lang: string) {
      state.lang = lang
      setCookie('lang', lang)
    },
    SET_SEARCH_RESULT(state: any, result: object) {
      state.searchResult = result
    },
    SET_CONFIG(state: any, config: object) {
      state.config = config
    },
    SET_PROPERTIES(state: any, properties: object) {
      state.innateProperties = properties
    },
    SET_SNAPSHOT_FACE(state: any, face: string) {
      state.snapshotFace = face
    },
    SET_CARD_SCANNING(state: any, val: boolean) {
      state.cardScanning = val
    },
    SET_BUSY(state: any, val: boolean) {
      state.busy = val
    },
    SET_CAMERA_WS(state: any, val: Socket) {
      state.cameraWS = val
    },
    SET_CAMERA_BIZ_WS(state: any, val: Socket) {
      state.cameraBizWS = val
    }
  }
})

export default store

