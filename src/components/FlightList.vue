<template>
  <div class="flight_list_wrap" :style="{height: props.height}">
    <!-- 出发航班 -->
    <el-table
      v-load-more="123"
      :data="props.data" 
      v-if="props.direction === 'D'" 
      height="forScroll"
      :empty-text="$t('general.noData')"
      v-loading="props.loading">
      <el-table-column 
        align="center" 
        :width="if55Page ? 450 : 190"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.flight')}}</p>
        </template>
        <template #default="scope">
          <div :style="{ height: if55Page ? '75px' : '30px' }">
            <RollUpContainer 
              :list="scope.row.shareList"
              type="flight"
              :inch="if55Page ? 55 : 32">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        :width="if55Page ? 250 : 140"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.sched')}}</p>
        </template>
        <template #default="scope">
          <span style="color: #FDCCB4;">
            {{scope.row.scheduleTime ? dayjs(Number(scope.row.scheduleTime)).format('HH:mm'): '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :width="if55Page ? 600 : 180">
        <template #header>
          <p>{{$t('table.dest')}}</p>
        </template>
        <template #default="scope">
          <div :style="{ width: '100%', height: if55Page ? '48px' : '24px' }">
            <RollUpContainer :list="scope.row.destsList" type="text" :inch="if55Page ? 55 : 32"></RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        width="400" 
        v-if="if55Page"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.counter')}}</p>
        </template>
        <template #default="scope">
          <span>{{scope.row.checkIns.length ? scope.row.checkIns[0].checkInDesk : '-'}}</span>
          <img
            v-if="if55Page && scope.row.checkIns.length && scope.row.terminal === 'T4'"
            :style="{width:'30px', marginLeft:'15px'}"
            src="../assets/images/navi.png"
            @click="navigate(scope.row.checkIns, 'checkin')">
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        :width="if55Page ? 270 : 150"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.terminal')}}</p>
        </template>
        <template #default="scope">
          {{scope.row.terminal === 'T1' ? 'T3' : scope.row.terminal}}
        </template>
      </el-table-column>
      <el-table-column
        :width="if55Page ? 270 : 150"
        align="center" 
        class-name="table_num">
        <template #header>
          <p>{{$t('table.gate')}}</p>
        </template>
        <template #default="scope">
          <LoopTextContainer>
            <span>{{scope.row.gateLabel ? scope.row.gateLabel : $t('general.unallocated')}}</span>
          </LoopTextContainer>
          <img
            v-if="!if55Page && scope.row.gateLabel && scope.row.terminal === 'T4'"
            :style="{width:'16px', marginLeft:'8px'}"
            src="../assets/images/navi.png"
            @click="navigate(scope.row.gates, 'gate')">
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template #header v-if="if55Page">
          <p>{{$t('table.checkin')}}</p>
        </template>
        <template #header v-else>
          <p>{{$t('table.status')}}</p>
        </template>
        <!-- 55寸显示办票时间 -->
        <template #default="scope" v-if="if55Page">
          <div :style="{width: '300px'}" class="table_num">
            <LoopTextContainer>
              {{(scope.row.checkIns[0] && scope.row.checkIns[0].checkinOpenDateTime) ? dayjs(Number(scope.row.checkIns[0].checkinOpenDateTime)).format('HH:mm') : ''}} - 
              {{(scope.row.checkIns[0] && scope.row.checkIns[0].checkinCloseDateTime) ? dayjs(Number(scope.row.checkIns[0].checkinCloseDateTime)).format('HH:mm') : ''}}
            </LoopTextContainer>
          </div>
        </template>
        <!-- 32寸显示状态 -->
        <template #default="scope" v-else>
          <div :style="{width: '100px'}" 
            :class="{'red':scope.row.flightStatus==='CX', 'yellow':scope.row.operationTypeCode==='DEL'}">
            <LoopTextContainer>
              {{ scope.row.operationTypeCode === 'DEL' ? scope.row.operationTypeDescription : 
              (scope.row.flightStatus in flightStatusMap ? $t(flightStatusMap[scope.row.flightStatus]) : $t(flightStatusMap['CS'])) }}
            </LoopTextContainer>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 到达航班 -->
    <el-table 
      v-load-more="123"
      :data="props.data" 
      height="forScroll"
      :empty-text="$t('general.noData')"
      v-loading="props.loading"
      v-else>
      <el-table-column 
        align="center" 
        :width="if55Page ? 450 : 190"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.flight')}}</p>
        </template>
        <template #default="scope">
          <div :style="{ height: if55Page ? '75px' : '30px' }">
            <RollUpContainer 
              :list="scope.row.shareList"
              type="flight"
              :inch="if55Page ? 55 : 32">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="city" align="center" :width="if55Page ? 650 : 210">
        <template #header>
          <p>{{$t('table.from')}}</p>
        </template>
        <template #default="scope">
          <div :style="{ width: '100%', height: if55Page ? '48px' : '24px' }">
            <RollUpContainer 
              :list="scope.row.destsList" 
              type="text">
            </RollUpContainer>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        :width="if55Page ? 300 : 130"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.sched')}}</p>
        </template>
        <template #default="scope">
          <span>
            {{scope.row.scheduleTime ? dayjs(Number(scope.row.scheduleTime)).format('HH:mm') : '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        :width="if55Page ? 400 : 130"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.actual')}}</p>
        </template>
        <template #default="scope">
          <span>
            {{scope.row.actualArriveTime ? dayjs(Number(scope.row.actualArriveTime)).format('HH:mm') : '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center" 
        :width="if55Page ? 270 : 150"
        class-name="table_num">
        <template #header>
          <p>{{$t('table.terminal')}}</p>
        </template>
        <template #default="scope">
           {{scope.row.terminal === 'T1' ? 'T3' : scope.row.terminal}}
        </template>
      </el-table-column>
      <el-table-column 
        prop="operationTypeDescription" 
        align="center">
        <template #header>
          <p>{{$t('table.status')}}</p>
        </template>
        <template #default="scope">
          <div :style="{width: if55Page ? '680px' : '180px'}">
            <LoopTextContainer>
              <span :class="{'red':scope.row.flightStatus==='CX', 'yellow':scope.row.operationTypeCode==='DEL'}"
                :style="{lineHeight: '1.5em'}">
                {{ scope.row.operationTypeCode === 'DEL' ? scope.row.operationTypeDescription : 
                (scope.row.flightStatus in flightStatusMap ? $t(flightStatusMap[scope.row.flightStatus]) : $t(flightStatusMap['CS'])) }}
              </span>
            </LoopTextContainer>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { airlineMap, flightStatusMap } from '../utils/generalMap'

const props = defineProps({
  height: {
    type: String,
    default: '100%'
  },
  data: {       // 传递过来一页的航班数据
    type: Array as () => Array<any>,
    required: true
  },
  direction: {  // 1：出发，2：到达
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['next'])
const nextPage = () => {
  emit('next')
}

// 节流处理timer
let timer: any = null
// 自定义指令 - 给el-table添加滚动事件的监听
const vLoadMore = {
  mounted: (el) => {
    let prevScrollTop = 0
    const tableWrap = el.querySelector('.el-table__body-wrapper')
    tableWrap.addEventListener('scroll', () => {
      // scrollHeight：整个list容器的总高度
      // clientHeight：视窗高度
      // scrollTop：滚动高
      // 在距离页面底部还剩50px的时候加载下一页数据，添加节流处理
      if((tableWrap.scrollHeight - tableWrap.clientHeight - tableWrap.scrollTop) < 50) {
        const currentScrollTop = tableWrap.scrollTop
        if(!timer && (currentScrollTop > prevScrollTop)) {
          timer = setTimeout(() => {
            console.log('next page')
            nextPage()
            timer = null
          }, 500)
        }
      }
      prevScrollTop = tableWrap.scrollTop
    })
  }
}

const route = useRoute()
// 计算属性：当前页面是否为55寸设备的页面
const if55Page =  computed(() => {
  const routesList = route.path.split('/')
  return routesList.indexOf('55') != -1
})

/**
 * arr: 传入的数组为登机口数组（gates）/ 值机柜台数组（checkIns）
 * type: 标识是登机口（gate）还是值机柜台（checkin）
 */
const router = useRouter()
const navigate = (arr: any[], type: string) => {
  if(arr.length) {
    // TODO - 获得的destName是对应点位的code还是name？需要确认
    // 跳转到机场地图页面，并通过url进行传递
    let destName = ''
    if(type === 'gate') {
      destName = arr[0].gateNumber
      router.push(`/AirportMap?destName=${destName}`)
    }else {
      /* 合众地图上面目前没有将值机柜台按照号码区分，只有大的区域，如：J，F，M，Q */
      destName = arr[0].checkInDesk.substring(0, 1)
      router.push(`/AirportMap/55?destName=${destName}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.red{
  background-color: #E22020;
  padding: 5px;
}
.yellow{
  background-color: #FCCF00;
  color: #000;
  padding: 5px;
}
</style>