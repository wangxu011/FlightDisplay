<template>
  <div id="cesiumContainer"></div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { onMounted } from 'vue'

onMounted(() => {
  // const url = 'http://106.38.108.70:18994/gateway/maps/{z}/{x}/{y}.png?token=66_c516f416cf1a4e68ac1897a23191a902'
  const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  // const viewer = new Cesium.Viewer('cesiumContainer')
  const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      credit: 'Topsci Mapscloud.',
      maximumLevel: 20,
      url
    })
  })
  viewer.camera.flyTo({
    destination:  Cesium.Cartesian3.fromDegrees(109.92081, 37.10866, 4000000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0),
      duration: 1
    }
  })
})
</script>

<style lang="scss">
#cesiumContainer{
  width: 100%;
  height: 100%;
}
</style>