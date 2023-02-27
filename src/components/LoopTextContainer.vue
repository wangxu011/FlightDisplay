<template>
  <div class="outer_wrap">
    <p class="content" v-loop="123"><slot></slot></p>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { onUnmounted, computed } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const if55 = computed(() => {
  const routesList = route.path.split('/')
  return routesList.indexOf('55') != -1
})

let timer = null
const loop = (el: any, type: string) => {
  const container = el.parentNode
  // 容器宽度
  const containerWidth = container.clientWidth
  // 获取内部元素的实际宽度
  const textActualWidth = el.scrollWidth
  
  // 初始位置，使得每次重新滚动时有一个顿挫感
  const initialPos = if55.value ? -20 : -10
  if(textActualWidth > containerWidth) {
    if(timer)
      clearInterval(timer)
    let scroll = initialPos
    timer = setInterval(() => {
      if(scroll <= (textActualWidth - containerWidth + 50)) {
        if55.value ? scroll += 2 : scroll ++
        container.scrollLeft = scroll
      } else {
        scroll = initialPos
        container.scrollLeft = initialPos
      }
    }, 30)
  }
}

// 自定义指令
const vLoop = {
  mounted(el, binding) {
    loop(el, 'mounted...')
  },
  updated(el, binding) {
    loop(el, 'update...')
  }
}

onUnmounted(() => {
  clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.outer_wrap{
  position: relative;
  overflow: hidden;
  .content{
    white-space:nowrap;
    line-height: normal;
  }
}
</style>