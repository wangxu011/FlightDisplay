import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

import i18n from '../i18n'
import { getCookie } from '../utils/cookies'
import { createMsg } from '../utils/message'
import { errorMap } from '../utils/generalMap'

// FDAxios表示航显系统中使用的axios实例，区分后面调用合众思壮接口的axios配置不发生冲突
const FDAxios: AxiosInstance = axios.create()

if(process.env.NODE_ENV === 'development') {
  // FDAxios.defaults.baseURL = 'http://192.168.88.50/fids'
  FDAxios.defaults.baseURL = 'http://wap.hzairport.com/fids'
} else {
  FDAxios.defaults.baseURL = `http://${window.location.hostname}/fids`
}

FDAxios.defaults.timeout = 60000

FDAxios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 判断是否为从DMZ区域发出的请求，若是，则需将协议由 http 改为 https
    if(config.baseURL) {
      const urlArr = config.baseURL.split('/')
      if(urlArr[2].startsWith('wap.hzairport.com')) {
        config.baseURL = config.baseURL.replace('http', 'https')
      }
    }
    // 缩小config.headers的范围，避免TS的检查报错
    if(config.headers === undefined){
      config.headers = {}
    }
    let lang = ''
    if(getCookie('lang') && (getCookie('lang') === 'EN')) {
      lang = 'en-US'
    }else {
      lang = 'zh-CN'
    }
    // 在请求头中添加多语言的设置
    config.headers['Accept-Language'] = lang
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

/* i18n.global.t: 常用的i18n方法都挂在i18n对象下的global属性 */
FDAxios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status === 200) {
      if(res.data.code === 200) {
        return Promise.resolve(res.data)
      }else {
        // 显示存在于errorMap中的错误
        if(res.data.code in errorMap) {
          createMsg('error', i18n.global.t(errorMap[res.data.code]), 'msg32')
        }else {
          // 针对人脸比对接口，不显示报错信息，在调用位置直接捕获错误，直接跳转到未比中
          if(res.data.code !== 100012)
            createMsg('error', res.data.message, 'msg32')
        }
        return Promise.reject(res.data)
      }
    }else {
      createMsg('error', res.data, 'msg32')
      return Promise.reject(res.data)
    }
  },
  (error: any) => {
    if(error.response.status === 404) {
      createMsg('error', '接口不存在', 'msg32')
    }else {
      createMsg('error', error, 'msg32')
    }
    return Promise.reject(error)
  }
)

export default FDAxios