<template>
  <div id="leaflet_map" ref="mapContainer"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import robotIcon from '../assets/images/robot/online_robot.png'
import placeIcon from '../assets/images/robot/destination.png'
import { _getRobotByCode, _getMarkerPositionByName } from '../axios/api/robotController'

const store = useStore()
const route = useRoute()

const props = defineProps({
  planRoute: {
    required: true,
    type: String
  },
  remainingTime: {
    required: true,
    type: Number
  }
})

onMounted(async () => {
  // 初始化地图，绘制召唤点位的icon
  initMap()
})

let map: any = null // map实例
const mapContainer = ref() // map容器

const width = config.leaflet.mapWidth
const height = config.leaflet.mapHeight
const originX = config.leaflet.originX
const originY = config.leaflet.originY
const imageUrl = config.leaflet.mapPath
const resolution = config.leaflet.resolution

// 航显所在位置对应在机器人激光地图中的code
const locationCode = store.state.innateProperties.deviceName || '北京航显'
let markerRes: any = null
let currentDeviceCoor: any = []

// 初始化地图
const initMap = async () => {
  // 根据召唤点位名称获取对应点位的位置信息（包括坐标，楼层）
  try {
    markerRes = await _getMarkerPositionByName(locationCode)
    currentDeviceCoor = [markerRes.value.x, markerRes.value.y]
  }catch(err) {
    console.log(err)
  }

  map = L.map(mapContainer.value, {
    center: [0, 0], 
    minZoom: 4,
    maxZoom: 5,
    zoom: 4,
    attributionControl: false,
    crs: L.CRS.Simple,
    zoomControl: false
  })
  const southWest = map.unproject([0, height], 4)
  const northEast = map.unproject([width, 0], 4)
  const bounds = L.latLngBounds(southWest, northEast)
  L.imageOverlay(imageUrl, bounds).addTo(map)
  map.setMaxBounds(bounds)

  // 绘制召唤点【注：就是航显所在的位置】的marker
  const placeLeafletCoor = convertToLeaflet(currentDeviceCoor)
  const icon = createIcon('place', placeIcon)
  // @ts-ignore
  L.marker(convertPixelToGeo(placeLeafletCoor), { icon }).addTo(map)

  // 先把召唤点位作为视图中心，待传递过来召唤轨迹后，再把机器人显示在中心
  map.setView(convertPixelToGeo(placeLeafletCoor))
}

watch(() => props.planRoute, (val, oldVal) => {
  let routePointList = []
  if(val) {
    routePointList = JSON.parse(val)
    console.log('剩余路径点长度：', routePointList.length)
    // 以路径集合的第一个点作为机器人的坐标
    const robotCoor = routePointList[0]
    drawRobotMarker(robotCoor, props.remainingTime)
  }else {
    // 空字符串，即机器人到达指定召唤位置，将机器人marker的坐标设置为召唤点坐标
    routePointList = []
    const leafletCoor = convertToLeaflet(currentDeviceCoor)
    const icon = createIcon('2', robotIcon, 0)
    robotMarker.setIcon(icon)
    robotMarker.setLatLng(convertPixelToGeo(leafletCoor))
  }
  drawPolygon(routePointList)
})

/**
 * 动态绘制机器人的icon
 */
let robotMarker: any = null  // 定义机器人marker接收变量，若存在则更新位置，否则新增
const drawRobotMarker = (arr: number[], time: number) => {
  const leafletCoor = convertToLeaflet(arr)
  const geoCoor = convertPixelToGeo(leafletCoor)

  if(!robotMarker) {
    const icon = createIcon('2', robotIcon, time)
    // @ts-ignore
    const marker = L.marker(geoCoor, { icon, zIndexOffset: 10 })
    marker.addTo(map)
    // 以机器人坐标作为视觉中心
    map.setView(geoCoor)
    robotMarker = marker
  }else {
    const icon = createIcon('2', robotIcon, time)
    robotMarker.setIcon(icon)
    robotMarker.setLatLng(geoCoor)
    map.setView(geoCoor)
  }
}

let polyline: any = null
const drawPolygon = (pointsCoor: number[][]) => {
  let latlngs: any[] = []
  if(pointsCoor.length) {
    latlngs = pointsCoor.map((item: number[]) => {
      const leafletCoor = convertToLeaflet(item)
      const geo = convertPixelToGeo(leafletCoor)
      return geo
    })
    if(!polyline) {
      let pl = L.polyline(latlngs, {color: '#00fffc', dashArray: '5', weight: 3})
      pl.addTo(map)
      polyline = pl
    } else {
      polyline.setLatLngs(latlngs)
    }
    // map.fitBounds(polyline.getBounds())
  } else {
    latlngs = []
    if(!polyline) {
      let pl = L.polyline(latlngs, {color: '#00fffc', dashArray: '5', weight: 3})
      pl.addTo(map)
      polyline = pl
    } else {
      polyline.setLatLngs(latlngs)
    }
    const leafletCoor = convertToLeaflet(currentDeviceCoor)
    map.setView(convertPixelToGeo(leafletCoor))
  }
}

/**
 * 将机器人传入坐标【注：这里的坐标指在激光地图中的坐标】转换成leaflet地图坐标【即图片像素坐标】
 */
const convertToLeaflet = (robotCoor: number[]) => {
  const result: number[] = []
  const newX: number= (robotCoor[0] - originX) / resolution
  const newY: number = height - (robotCoor[1] - originY) / resolution
  result.push(newX)
  result.push(newY)
  return result
}

/**
 * 绘制点位对应的icon
 */
const createIcon = (type: string, img: any, second?: number) => {
  let html = ''
  if(type === 'place') {
    html = `<div class='wrap${type}'>
            <img src=${img} />
            </div>`
  } else {
    if(second && second > 0) {
      if(second < 60) {
        html = `<div class='wrap${type}'>
            <p class='minute'>${second}秒</p>
            <p class='word'>预计到达</p>
            <img src=${img} />
            </div>`
      }else {
        html = `<div class='wrap${type}'>
            <p class='minute'>${Math.floor(second / 60)}分钟</p>
            <p class='word'>预计到达</p>
            <img src=${img} />
            </div>`
      }
    } else {
      html = `<div class='wrap${type}'>
            <p class='word'>已到达</p>
            <img src=${img} />
            </div>`
    }
  }
  const icon = L.divIcon({
    className: 'custom-marker-icon-wrap',
    html,
    iconAnchor: [20, 40]   // 实际点位坐标为图片底边中心
  })
  return icon
}

/**
 * 将图片上的像素坐标转换成地理坐标，当前zoom设置为4，可根据情况调整
 */
const convertPixelToGeo = (array: number[]) => {
  let resultArr: any[] = []
  resultArr.push(map.unproject(array, 4).lat)
  resultArr.push(map.unproject(array, 4).lng)
  return resultArr
}
</script>

<style lang="scss" scoped>
#leaflet_map{
  height: 100%;
}
</style>