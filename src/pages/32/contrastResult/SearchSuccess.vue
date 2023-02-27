<template>
  <Layout_32>
    <div class="success_result_container">
      <div class="inner_wrap">
        <p class="title">
          <LoopTextContainer> 
            <span>{{$t('tip.passenger')}}</span>
            <span>&nbsp;{{flightInfo.name}}&nbsp;</span>
            <span>{{$t('tip.searchResultTitle')}}</span>
          </LoopTextContainer>
        </p>
        <div class="info_wrap" :style="{ paddingTop: (locale==='EN' ? '45px' : '56px') }">
          <div class="top">
            <div class="place_wrap">
              <p class="weather">
                <LoopTextContainer>
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="weatherMap[flightInfo.dept.weatherType]"></use>
                  </svg>
                  <span>{{flightInfo.dept.temperature || '-'}}℃</span>
                  <span> {{flightInfo.dept.weatherDescription}}</span>
                </LoopTextContainer>
              </p>
              <p class="city">
                <LoopTextContainer>{{flightInfo.dept.airport}}</LoopTextContainer>
              </p>
              <!-- <p class="airport">
                <LoopTextContainer>
                  {{flightInfo.dept.airport}} {{flightInfo.terminal}}
                </LoopTextContainer>
              </p> -->
            </div>
            <div class="plane_wrap">
              <p class="flight_no">{{flightInfo.flightIdentity}}</p>
              <div class="img_wrap">
                <img src="../../../assets/images/32/small-plane.png" alt="">
              </div>
              <!-- 显示座位号 -->
              <p class="seat">
                <span>{{$t('general.seatNo')}}</span>
                <span>&nbsp;{{flightInfo.seat || '-'}}</span>
              </p>
              <!-- 经停地显示 -->
              <!-- <p class="via">{{flightInfo.data.destinations}}</p> -->
            </div>
            <div class="place_wrap">
              <p class="weather">
                <LoopTextContainer>
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="weatherMap[flightInfo.dest.weatherType]"></use>
                  </svg>
                  <span>{{flightInfo.dest.temperature || '-'}}℃</span>
                  <span> {{flightInfo.dest.weatherDescription}}</span>
                </LoopTextContainer>
              </p>
              <p class="city">
                <LoopTextContainer>
                  {{flightInfo.dest.airport}}
                </LoopTextContainer>
              </p>
              <!-- <p class="airport">
                <LoopTextContainer>
                  {{flightInfo.dest.airport}}
                </LoopTextContainer>
              </p> -->
            </div>
          </div>
          <div class="bottom" :style="{ marginTop: (locale==='EN' ? '42px' : '65px') }">
            <div class="item">
              <p class="label">{{$t('general.gate')}}</p>
              <p class="value" style="color:#00ddc9;">
                <LoopTextContainer>
                  {{flightInfo.gate || $t('general.unallocated')}}
                </LoopTextContainer>
              </p>
            </div>
            <div class="item">
              <p class="label">{{$t('general.scheduleTime')}}</p>
              <p class="value">
                <LoopTextContainer>
                  {{dayjs(Number(flightInfo.scheduleTime)).format('HH:mm')}}
                </LoopTextContainer>
              </p>
            </div>
            <div class="item">
              <p class="label">{{$t('general.flightStatus')}}</p>
              <p class="value">
                <LoopTextContainer>
                  {{flightInfo.flightStatus}}
                </LoopTextContainer>
              </p>
            </div>
          </div>
        </div>
        <div v-if="enableCallingRobot">
          <CallRobot 
            :scheduleTime="flightInfo.scheduleTime" 
            :gate="flightInfo.gate">
          </CallRobot>
        </div>
        <div class="map_wrap" :class="{'enable_robot': enableCallingRobot}">
          <OpenLayer :name="destName"></OpenLayer>
        </div>
      </div>
    </div>
  </Layout_32>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Layout_32 from '../../../components/layout/Layout_32.vue'
import OpenLayer from '../../../components/OpenLayer.vue'
import CallRobot from '../../../components/CallRobot.vue'

import { weatherMap, flightStatusMap } from '../../../utils/generalMap'
import { CityDesc } from '../../../interface/flight'

import dayjs from "dayjs"

interface flightDesc {
  name: string,
  seat: string,
  terminal: string,
  flightIdentity: string,
  gate: string,
  scheduleTime: string,
  flightStatus: string,
  dept: CityDesc,
  dest: CityDesc
}

const store = useStore()
const { locale, t } = useI18n()

let flightInfo: flightDesc = reactive({
  name: '',       // 新增加的name属性
  seat: '',       // 新增加的seat属性
  terminal: '',
  flightIdentity: '',
  gate: '',
  scheduleTime: '',
  flightStatus: '',

  // 以下为单独处理的属性
  dept: {
    city: '',
    airport: '',
    weatherType: '',
    weatherDescription: '',
    temperature: ''
  },
  dest: {
    city: '',
    airport: '',
    weatherType: '',
    weatherDescription: '',
    temperature: ''
  }
})

const destName = ref('')
const enableCallingRobot = ref(false)
onMounted(() => {
  // mock data
  // flightInfo.name = 'WangXu'
  // flightInfo.seat = '40H'
  // flightInfo.terminal = 'T3'
  // flightInfo.flightIdentity = 'HU1234'
  // flightInfo.gate = 'B83'
  // flightInfo.scheduleTime = '20:10'
  // flightInfo.flightStatus = '计划'
  // flightInfo.dept = {
  //   city: 'BEIJING',
  //   airport: '首都机场',
  //   weatherType: '晴天',
  //   weatherDescription: '晴',
  //   temperature: '23'
  // }
  // flightInfo.dest = {
  //   city: 'BEIJING',
  //   airport: '南京禄口',
  //   weatherType: '晴天',
  //   weatherDescription: '晴',
  //   temperature: '24'
  // }

  // 是否开始召唤机器人功能
  enableCallingRobot.value = store.state.innateProperties.callRobot || true
  console.log("result from QT: ", store.state.searchResult)
  if(store.state.searchResult.value) {
    let obj = store.state.searchResult.value
    // 新增属性：name, seat
    flightInfo.name = obj.passengerName
    flightInfo.seat = obj.seat

    if(obj.flightInfo) {
      flightInfo.terminal = obj.flightInfo.terminal
      flightInfo.flightIdentity = obj.flightInfo.flightIdentity
      flightInfo.scheduleTime = obj.flightInfo.scheduleTime
      
      // 航班状态
      if(obj.flightInfo.operationTypeCode === 'DEL') {
        flightInfo.flightStatus = obj.flightInfo.operationTypeDescription
      }else {
        if(obj.flightInfo.flightStatus in flightStatusMap) {
          flightInfo.flightStatus = t(flightStatusMap[obj.flightInfo.flightStatus])
        }else {
          flightInfo.flightStatus = t(flightStatusMap['CS'])
        }
      }
      
      // 登机口处理
      if(obj.flightInfo.gates.length){
        flightInfo.gate = obj.flightInfo.gates[obj.flightInfo.gates.length - 1].gateNumber
        // 将登机口名称传递给地图
        destName.value = flightInfo.gate
      }
    }

    // 分别处理出发地、目的地的信息
    // Depature
    flightInfo.dept.city = obj.dept.city
    flightInfo.dept.airport = obj.dept.airportName
    if(obj.weather4Dept) {
      flightInfo.dept.weatherType = obj.weather4Dept.weatherType
      flightInfo.dept.weatherDescription = obj.weather4Dept.weatherDescription
      flightInfo.dept.temperature = obj.weather4Dept.temperature
    }
    // Destination
    flightInfo.dest.city = obj.dest.city
    flightInfo.dest.airport = obj.dest.airportName
    if(obj.weather4Dest) {
      flightInfo.dest.weatherType = obj.weather4Dest.weatherType
      flightInfo.dest.weatherDescription = obj.weather4Dest.weatherDescription
      flightInfo.dest.temperature = obj.weather4Dest.temperature
    }
  }
})

</script>
<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.success_result_container{
  height: 100%;
  padding: 0 35px 35px;
  .inner_wrap{
    height: 100%;
    box-shadow: -1px 7px 13px 0px rgb(37 38 38 / 70%);
    border-radius: 15px;
    padding: 35px;
    background-color: rgba(255, 255, 255, .7);
    .title{
      font-size: 26px;
      text-align: left;
    }
    .info_wrap{
      height: 435px;
      padding-top: 56px;
      margin-top: 20px;
      background-size: cover;
      background-image: url('../../../assets/images/32/flight_info_card_bg.png');
      .top{
        @include centerBox();
        padding: 0 50px;
        .place_wrap{
          width: 320px;
          .city{
            font-size: 61px;
            font-weight: 500;
            margin: 20px 0;
          }
          .airport{
            font-size: 29px;
          }
          .weather{
            font-size: 30px;
            line-height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            svg{
              font-size: 40px;
              margin-right: 5px;
            }
          }
        }
        .plane_wrap{
          width: 300px;
          .flight_no{
            font-size: 32px;
            margin-bottom: 10px;
          }
          .img_wrap{
            // height: 32px;
            img{
              width: 100%;
            }
          }
          .seat, .via{
            font-size: 26px;
            margin-top: 10px;
          }
        }
      }
      .bottom{
        margin-top: 65px;
        padding: 0 100px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item{
          width: 27%;
          margin-top: 20px;
          .label{
            font-size: 30px;
            color: #6C6B66;
          }
          .value{
            font-size: 55px;
            color: #000000;
            margin-top: 30px;
          }
        }
      }
    }
    .map_wrap{
      height: calc(100% - 501px);
      margin-top: 20px;
    }
    .enable_robot{
      height: calc(100% - 618px);
    }
  }
}
</style>