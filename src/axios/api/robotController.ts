import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

import baseListResponse from '../vo/baseListResponse'
import baseObjectResponse from '../vo/baseObjectResponse'

import { createMsg } from '../../utils/message'

const RobotAxios: AxiosInstance = axios.create()
if(process.env.NODE_ENV === 'development') {
  RobotAxios.defaults.baseURL = 'http://192.168.88.31/recolinks'
} else {
  RobotAxios.defaults.baseURL = `http://${window.location.hostname}/recolinks`
}

RobotAxios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 判断是否为从DMZ区域发出的请求，若是，则需将协议由 http 改为 https
    if(config.baseURL) {
      const urlArr = config.baseURL.split('/')
      if(urlArr[2].startsWith('wap.hzairport.com')) {
        config.baseURL = config.baseURL.replace('http', 'https')
      }
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

RobotAxios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status === 200) {
      if(res.data.code === 200) {
        return Promise.resolve(res.data)
      }else {
        createMsg('error', res.data.message, 'msg32')
        return Promise.reject(res.data)
      }
    }else {
      createMsg('error', res.data, 'msg32')
      return Promise.reject(res.data)
    }
  },
  (error: any) => {
    console.log(error)
    createMsg('error', error, 'msg32')
    return Promise.reject(error)
  }
)

export const _getAllRobots = (): Promise<baseObjectResponse<any[]>> => {
  return RobotAxios.get('/v1/device/robots/all')
}

export const _robotControl = (data: object): Promise<baseObjectResponse<null>> => {
  return RobotAxios.post('/v1/device/robots/control', data)
}

/**
 * 单独抽离出的召唤接口，限于航显召唤机器人使用，移动端召唤仍使用上面的接口
 * @param data 
 * @returns 
 */
export const _callRobot = (data: object): Promise<baseObjectResponse<null>> => {
  return RobotAxios.post('/v1/device/robots/call', data)
}

export const _getRobotByCode = (code: string): Promise<baseObjectResponse<any>> => {
  return RobotAxios.get(`/v1/device/robots/getByCode?code=${code}`)
}

/**
 * 根据点位名称获取对应点位的坐标信息
 * @param markerName 
 * @returns 
 */
export const _getMarkerPositionByName = (markerName: string): Promise<baseObjectResponse<any>> => {
  return RobotAxios.get(`/v1/device/robots/getPositionByMarker?marker=${markerName}`)
}

/**
 * 查询某次召唤操作的结果
 * @param id 
 * @returns (0: running, 1: success, 2: failed, 3: cancel)
 */
export const _getCallResult = (id: string): Promise<baseObjectResponse<any>> => {
  return RobotAxios.get(`/v1/robotCallRecord/${id}`)
}

