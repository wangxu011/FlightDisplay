<template>
  <div class="roll_up_container">
    <!-- 航班的显示，带着前面航空公司的Logo -->
    <TransitionGroup name="rollup" v-if="props.type==='flight'">
      <div :class="{ 'wrapper_32': props.inch === 32, 'wrapper_55': props.inch === 55 }" 
        v-for="(item, index) in props.list" 
        :key="index"
        v-show="visibleFlag === index">
        <div class="img_wrap" :style="{background: airlineMap[item.substring(0, 2)] ? '#fff' : 'transparent'}">
          <img :src="airlineMap[item.substring(0, 2)]">
        </div>
        <div class="flight_no">{{item}}</div>
      </div>
    </TransitionGroup>
    <!-- 普通文本的显示 -->
    <TransitionGroup name="rollup" v-else>
      <p v-for="(item, index) in props.list"
        :key="item"
        v-show="visibleFlag === index"
        class="text_wrap">{{item}}
      </p>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, watch } from 'vue'

import { airlineMap } from '../utils/generalMap'

const props = defineProps({
  // 循环显示的数据源
  list: {
    type: Array as () => Array<any>,
    required: true,
  },
  // 数据类型：flight：航班号，需要显示对应的航空公司logo；text：文本，直接展示
  type: {
    type: String,
    required: true
  },
  // 设备尺寸类型：32 / 55
  inch: {
    type: Number,
    required: false
  }
})

const visibleFlag = ref(0)

let timer: NodeJS.Timer | null = null
watch(() => props.list, (val, oldVal) => {
  if(timer) {
    clearInterval(timer)
    visibleFlag.value = 0
  }
  if(val.length > 1) {
    // 定时器轮询，每隔2秒显示下一个
    timer = setInterval(() => {
      if(visibleFlag.value === val.length - 1) {
        visibleFlag.value = 0
      }else {
        visibleFlag.value ++
      }
    }, 5000)
  }
}, {immediate: true})

onBeforeUnmount(() => {
  if(timer)
    clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.roll_up_container{
  position: relative;
  display: flex;
  justify-content: center;
  .text_wrap{
    display: flex;
    align-items: center;
    position: absolute;
  }
  .wrapper_32{
    display: flex;
    align-items: center;
    position: absolute;
    .img_wrap{
      width: 30px;
      height: 30px;
      border-radius: 4px;
      overflow: hidden;
      text-align: center;
      position: relative;
      background-color: #fff;
      img{
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .flight_no{
      min-width: 90px;
      height: 22px;
      margin-left: 10px;
      text-align: left;
    }
  }
  .wrapper_55{
    display: flex;
    align-items: center;
    position: absolute;
    .img_wrap{
      width: 74px;
      height: 74px;
      border-radius: 6px;
      overflow: hidden;
      text-align: center;
      position: relative;
      background-color: #fff;
      img{
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .flight_no{
      width: 177px;
      margin-left: 20px;
      text-align: left;
    }
  }
  .rollup-leave-active,
  .rollup-enter-active {
    transition: all 1s;
  }
  .rollup-enter-from{
    opacity: 0;
    transform: translateY(30px);
  }
  .rollup-leave-to {
    opacity: 0;
  }
}
</style>