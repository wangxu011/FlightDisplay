<template>
  <div class="call_robot_wrap" @click="callRobot" :class="{'en': locale === 'EN'}"></div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, h } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { _getAllRobots, _callRobot, _getMarkerPositionByName } from '../axios/api/robotController'
import { robotVO } from '../interface/robotType'
import { createMsg } from '../utils/message'

import { ElLoading, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

import callRobotGif from '../assets/images/32/gif/call_robot.gif'

const store = useStore()
const router = useRouter()
const { locale, t } = useI18n()

const nearestRobotCoor = ref<number[]>([])
const nearestRobotCode = ref('')
// 航显设备点位详情
let markerRes:any = null 

const props = defineProps({
  scheduleTime: {
    type: String,
    required: true
  },
  gate: {
    type: String,
    required: true
  }
}) 

// 召唤机器人
const callRobot = async () => {
  // 判断当前时间距离计划起飞时间是否小于20分钟
  if(props.scheduleTime && (Number(props.scheduleTime) - new Date().getTime() < 1200000)) {
    ElMessageBox({
      title: t('tip.prompt'),
      message: h('p', null, [
        h('span', null, t('tip.aboardTime')),
        h('span', { style: 'color: #DD0000;font-weight: bold;'}, t('tip.lessThan20')),
        h('span', null, `，${t('tip.goStraight')}`),
      ]),
      type: 'warning',
      showCancelButton: true,
      showClose: false,
      cancelButtonText: t('general.resumeCall'),
      confirmButtonText: t('tip.isee'),
      customClass: 'my-msg-box',
      confirmButtonClass: 'my-confirm-box',
      cancelButtonClass: 'my-cancel-box'
    }).catch((action: Action) => {
      // 继续召唤
      console.log('keep calling...')
      preAsk()
    })
    return null
  }
  preAsk()
}

// 判断是否存在空闲机器人
const judgeHasFreeRobot = async () => {
  if(store.state.innateProperties.deviceName) {
    // 真实的召唤点位的code通过客户端配置传递过来，测试先写死为 "北京航显"
    // const locationCode = '北京航显'
    const locationCode = store.state.innateProperties.deviceName
    let currentDeviceCoor: any = []
    let currentFloor = null
    let mapName = ''
    // 1、根据召唤点位的code查询对应点位的位置信息（包括坐标，楼层）
    try {
      markerRes =  await _getMarkerPositionByName(locationCode)
      console.log('marker res: ', markerRes)
      currentDeviceCoor = [markerRes.value.x, markerRes.value.y]
      currentFloor = markerRes.value.floor
      mapName = markerRes.value.mapName
    }catch(err) {
      console.log(err)
      return
    }  
    
    let freeRobotList: robotVO[] = []
    let freeRobotCoorList: any[] =[]

    // 2、获取所有机器人列表
    const res = await _getAllRobots()

    // 3、筛选出所有的空闲机器人
    // 条件1：robotStatus === 1：处于空闲状态；
    // 条件2：canCallRobot === 1：机器人可以被召唤；
    // 条件3：机器人与航显在同一层；
    // 条件4：机器人对应的mapName与航显地图名称相同；
    const fdFloor: number = currentFloor || 1 // 航显所在楼层
    if(res.value.length) {
      freeRobotList = res.value.filter((item: robotVO) => 
        item.robotStatus === 1
        && item.canCallRobot === 1
        && item.floor === fdFloor
        && item.mapName === mapName)
      console.log('free robot count: ', freeRobotList.length)
    }
    // 4、将在线机器人列表重组，转换成对应的坐标数组
    if(freeRobotList.length) {
      freeRobotCoorList = freeRobotList.map((item: robotVO) => [item.x, item.y, item.deviceAccessKey])
      // 5、遍历freeRobotCoorList中的坐标，计算距离当前航显最近的空闲机器人对应的坐标
      const result = getNearestCoor(freeRobotCoorList, currentDeviceCoor)

      // 最近机器人的code
      nearestRobotCode.value = result.code
      // 最近机器人的坐标
      nearestRobotCoor.value = result.coor

      console.log('nearest robot code: ', nearestRobotCode.value)
      console.log('nearest robot coor: ', nearestRobotCoor.value)
    }
  }else {
    createMsg('warning', t('tip.setDevicePosition'), 'msg32', 5000)
  }
}

/**
 * 二次确认弹窗
 */
const preAsk = async () => {
  // 判断是否存在空闲机器人
  await judgeHasFreeRobot()

  if(!markerRes) {
    createMsg('warning', t('tip.pointNotExist'), 'msg32', 3000)
    return null
  }
  if(nearestRobotCode.value) {
    // 弹出再次确认对话框
    ElMessageBox({
      message: h('div', { class: 'call_robot_wrap' }, [
        h('p', { class: 'title' }, `${t('tip.robotTakeYou', { robotName: t('general.robotName') })}「${props.gate||'休息区'}」`),
        h('div', { class: 'img_wrap' }, [
          h('img', { src: callRobotGif, class: 'img' })
        ])
      ]),
      confirmButtonText: t('tip.callNow'),
      customClass: 'call-robot-msg-box',
      confirmButtonClass: 'my-confirm-box',
    }).then(() => {
      callRobotLogic()
    })
  }else {
    // 暂无空闲机器人
    ElMessageBox({
      title: t('tip.prompt'),
      message: t('tip.noFreeRobot'),
      type: 'warning',
      showClose: false,
      confirmButtonText: t('tip.isee'),
      customClass: 'my-msg-box',
      confirmButtonClass: 'my-confirm-box'
    })
  }
}

/**
 * 召唤机器人的具体代码
 */
let callLoading: any = null
const callRobotLogic = async () => {
  // 真实的召唤点位
  const positionCode = store.state.innateProperties.deviceName
  // const positionCode = '北京航显'  // test, mock data
  const obj: Object = {
    code: nearestRobotCode.value,
    // 召唤位置
    positionCode: positionCode,
    // 导航终点
    destCode: props.gate ? props.gate : '休息区'
  }
  callLoading = ElLoading.service({
    lock: true,
    text: t('tip.calling'),
    background: 'rgba(10, 10, 10, .5)',
    customClass: 'call_robot_32'
  })
  // call interface
  let callResult:any = null
  try {
    callResult = await _callRobot(obj)
    callLoading.close()
    console.log('call robot res: ', callResult.value)
    // TODO - 将召唤任务id: [callResult.value] 传递到 CallingRobot 页面，用于实时获取召唤状态
    if(callResult.code === 200) {
      // 跳转至机器人召唤过程中显示实时位置的页面，并传递机器人Code
      router.push(`/CallingRobot?robotCode=${nearestRobotCode.value}&callId=${callResult.value}`)
    }else {
      createMsg('error', t('tip.callFailed'), 'msg32')
    }
  }catch(err) {
    callLoading.close()
  }  
}

/**
 * 根据传入坐标集合与指定点位，返回距离指定点位最近的点的坐标
 */
const getNearestCoor = (coorList: any[][], target: number[]) => {
  console.log('target coor: ', target)
  let minIndex = 0
  let minDistance = 1000
  coorList.forEach((item: any[], index: number) => {
    let d = Math.pow(item[0] - target[0], 2) + Math.pow(item[1] - target[1], 2)
    if(d < minDistance) {
      minDistance = d
      minIndex = index
    }
  })
  // console.log('距离目标点位最近的空闲机器人坐标：', coorList[minIndex])
  return {
    'coor': [coorList[minIndex][0], coorList[minIndex][1]],
    'code': coorList[minIndex][2]
  }
}

onBeforeUnmount(() => {
  // 将所有弹窗进行隐藏
  ElMessageBox.close()
  callLoading?.close()
})
</script>

<style lang="scss" scoped>
.call_robot_wrap{
  height: 117px;
  font-size: 30px;
  line-height: 60px;
  background-image: url(../assets/images/robot/call_robot.png);
  background-size: cover;
}
.en{
  background-image: url(../assets/images/robot/call_robot_en.png);
}
</style>