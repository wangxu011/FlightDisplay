<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { onMounted } from 'vue'

// 实例化地图对象
let map: any = null

onMounted(() => {
  initMap()
})

const initMap = () => {
  const container = document.getElementById('map')
  console.log(container?.clientWidth)
  console.log(container?.clientHeight)
  map = new RTMap3D.RTMap(container, {
    width: container?.clientWidth,
    height: container?.clientHeight,
    dataAddr: config.rtMap.resources,   // 资源根路径
    configFile: "mapconfig_862700010070100002.json",  //地图配置文件名称
    defaultFloor: config.rtMap.floor,   // 默认展示楼层
    bOutdoorMap: false,        //是显示载室外地图
    bPreloadFloors: false,     //是否预渲染所有楼层 
    planRouteAnimated: true,
    searchControl: true
  })
  map.mapEngine.dataSource = 'json'
  map.load(config.rtMap.buildId, config.rtMap.key, config.rtMap.mapZoom)
  return new Promise((resolve, reject) => {
    map.on('sceneCreated', () => {
      console.log('智慧图地图加载完成 ===>>>')
      map.enableRotation = true
      map.autoChange2DMode = true
      map.pitch(config.rtMap.pitch)
      map.zoom(config.rtMap.mapZoom, true)
      resolve(true)
    })
    // map.on('on_region_click', (reginInfo) => {
    //   console.log(reginInfo)
    // })
  })
}
</script>

<style lang="scss" scoped>
#map{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>