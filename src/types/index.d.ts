type HZ = {
  mapHost: string,
  apiHost: string,
  orgaFlag: string,
  orgaKey: string
}

type Leaflet = {
  mapWidth: number,
  mapHeight: number,
  originX: number,
  originY: number,
  mapPath: string,
  resolution: number
}

type WS = {
  camera: string,
  cameraBiz: string
}

type Config = {
  leaflet: Leaflet,
  rtMap: Object,
  hz: HZ,
  ws: WS,
  enableCallingRobot: boolean,
  returnHomeTimeout: number
}

declare const config: Config

// 声明在Window上的自定义属性
interface Window {
  CallBridge: any,
  returnSearchResult: function,
  returnDeviceProperties: function
}