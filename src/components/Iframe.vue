<template>
  <div class="iframe_wrap">
    <iframe :src="src"></iframe>
  </div>
</template>

<script lang="ts" setup>

const src = 'https://jichang.rtmap.com/hangzhouMap/index.html?key=k7i23869hd&buildid=862700010070100002&zoom=0.1&floor=F3'

// 预设终点、起点坐标，默认展示两点之间的规划路径
// const src = 'https://jichang.rtmap.com/hangzhouMap/index.html?key=k7i23869hd&buildid=862700010070100002&zoom=0.1&floor=F3&startpoi=F3,474,-381&endpoi=F3,745,-340,'

// @ts-ignore
// window.iframeOnload = (e) => {
//   console.log(7845)
//   // const location = e.contentWindow.document.querySelector('rt-curr-loca')
//   console.log(e.contentWindow.document)
// }
</script>

<style lang="scss" scoped>
.iframe_wrap{
  width: 100%;
  height: 100%;
  iframe{
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>