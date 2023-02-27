import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/general.scss'
import './assets/styles/my-element-ui.scss'
import './assets/styles/my-leaflet.scss'
import './assets/styles/my-openlayers.scss'
// 富文本样式
import './assets/styles/quill.bubble.css'
import './assets/styles/quill.core.css'
import './assets/styles/quill.snow.css'

import router from './router/index'

import store from './store/index'

// 多语言
import i18n from './i18n'

// element-plus/icons
import { ArrowLeft, ArrowRight, HomeFilled, Search, Back, Close, Aim, Position } from '@element-plus/icons'

// 需要手动引入组件级的css，否则像messageBox这些的样式不会出现
// https://element-plus.gitee.io/zh-CN/guide/quickstart.html#manually-import
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'

// import Channel from './qt/Channel'

const app = createApp(App)

// 设置全局变量；QtChannel，保证全局单例
// let qtWebChannel: any = new Channel()
// app.config.globalProperties.QTChannel = qtWebChannel

// element-plus的全局设置
app.config.globalProperties.$ELEMENT = {
  size: 'medium',
  zIndex: 3000
}

// 全局注册element-plus中的icon
app.component('arrow-left', ArrowLeft)
app.component('arrow-right', ArrowRight)
app.component('home-filled', HomeFilled)
app.component('search', Search)
app.component('back', Back)
app.component('close', Close)
app.component('aim', Aim)
app.component('position', Position)


app.use(router)
  .use(store)
  .use(i18n)
  .mount('#app')