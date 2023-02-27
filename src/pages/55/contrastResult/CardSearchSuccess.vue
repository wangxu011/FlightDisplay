<template>
  <Layout_55>
    <div class="search_success_wrap">
      <div class="inner_wrap">
        <p class="title">{{$t('general.flightInfo')}}</p>
        <div class="content_wrap">
          <div class="left_wrap">
            <div class="title_wrap">
              <div class="img_wrap">
                <img src="../../../assets/images/55/map_logo.png">
              </div>
              <p class="word">{{$t('general.naviMap')}}</p>
            </div>
            <div class="map_wrap">
              <OpenLayer :name="destName"></OpenLayer>
            </div>
          </div>
          <div class="right_wrap">
            <p class="word">
              <LoopTextContainer>
                <span>{{$t('tip.passenger') }}</span>
                <span>&nbsp;{{flightInfo.name}}&nbsp;</span>
                <span>{{$t('tip.searchResultTitle')}}</span>
              </LoopTextContainer>
            </p>
            <div class="info_wrap">
              <div class="top">
                <div class="place_wrap">
                  <p class="weather">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="weatherMap[flightInfo.dept.weatherType]"></use>
                    </svg>
                    <span>{{flightInfo.dept.temperature || '-'}}℃&nbsp;</span>
                    <span>{{flightInfo.dept.weatherDescription}}</span>
                  </p>
                  <p class="city">
                    <LoopTextContainer>
                      {{flightInfo.dept.city}}
                    </LoopTextContainer>
                  </p>
                </div>
                <div class="plane_wrap">
                  <p class="no">{{flightInfo.flightIdentity}}</p>
                  <div class="img_wrap">
                    <img src="../../../assets/images/55/plane.png" alt="">
                  </div>                  
                </div>
                <div class="place_wrap">
                  <p class="weather">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="weatherMap[flightInfo.dest.weatherType]"></use>
                    </svg>
                    <span>{{flightInfo.dest.temperature || '-'}}℃&nbsp;</span>
                    <span>{{flightInfo.dest.weatherDescription}}</span>
                  </p>
                  <p class="city">
                    <LoopTextContainer>
                      {{flightInfo.dest.city}}
                    </LoopTextContainer>
                  </p>
                </div>
              </div>
              <div class="bottom">
                <div class="item">
                  <p class="label">{{$t('subPage.checkinCounter.title')}}</p>
                  <div class="value" style="color:#00ddc9;">
                    <RollUpContainer
                      :list="flightInfo.checkIn" 
                      type="text">
                    </RollUpContainer>
                  </div>
                </div>
                <div class="item">
                  <p class="label">{{$t('general.gate')}}</p>
                  <p class="value">
                    <LoopTextContainer>
                      {{flightInfo.gate || $t('general.unallocated')}}
                    </LoopTextContainer>
                  </p>
                </div>
                <div class="item">
                  <p class="label">{{$t('general.scheduleTime')}}</p>
                  <p class="value">{{dayjs(Number(flightInfo.scheduleTime)).format('HH:mm')}}</p>
                </div>
                <div class="item">
                  <p class="label">{{$t('general.airlines')}}</p>
                  <p class="value">
                    <LoopTextContainer>{{flightInfo.carrierName}}</LoopTextContainer>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout_55>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import Layout_55 from '../../../components/layout/Layout_55.vue'
import OpenLayer from '../../../components/OpenLayer.vue'

import { weatherMap } from '../../../utils/generalMap'
import { CityDesc } from '../../../interface/flight'

import dayjs from "dayjs"

const store = useStore()

interface flightDesc {
  name: string,
  flightIdentity: string,
  checkIn: string[],
  gate: '',
  scheduleTime: '',
  carrierName: '',
  dept: CityDesc,
  dest: CityDesc
}

let flightInfo: flightDesc = reactive({
  name: '',
  flightIdentity: '',
  checkIn: [],
  gate: '',
  scheduleTime: '',
  carrierName: '',

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
onMounted(() => {
  console.log("result from QT: ", store.state.searchResult)
  if(store.state.searchResult.value) {
    let obj = store.state.searchResult.value

    flightInfo.name = obj.passengerName
    flightInfo.flightIdentity = obj.flightInfo.flightIdentity
    flightInfo.scheduleTime = obj.flightInfo.scheduleTime
    flightInfo.carrierName = obj.flightInfo.carrierName

    // 值机柜台处理
    if(obj.flightInfo.checkIns.length){
      let checkins: string[] = []
      if(obj.flightInfo.checkIns[1].checkInDesk) {
        checkins.push(obj.flightInfo.checkIns[1].checkInDesk)
      }
      if(obj.flightInfo.checkIns[0].checkInDesk) {
        checkins.push(obj.flightInfo.checkIns[0].checkInDesk)
      }
      flightInfo.checkIn = checkins
      /**
       * 由于合众地图上面目前没有将值机柜台按照号码区分，只有大的区域，如：J，F，M，Q
       * 将处理后的区域号传递给地图
       */
      destName.value = flightInfo.checkIn[0].substring(0, 1)
    }

    // 登机口处理
    if(obj.flightInfo.gates.length){
      flightInfo.gate = obj.flightInfo.gates[obj.flightInfo.gates.length - 1].gateNumber
    }
    
    // 分别处理出发地、目的地的信息
    // Depature
    flightInfo.dept.city = obj.dept.airportName
    if(obj.weather4Dept) {
      flightInfo.dept.weatherType = obj.weather4Dept.weatherType
      flightInfo.dept.weatherDescription = obj.weather4Dept.weatherDescription
      flightInfo.dept.temperature = obj.weather4Dept.temperature
    }
    // Destination
    flightInfo.dest.city = obj.dest.airportName
    if(obj.weather4Dest) {
      flightInfo.dest.weatherType = obj.weather4Dest.weatherType
      flightInfo.dest.weatherDescription = obj.weather4Dest.weatherDescription
      flightInfo.dest.temperature = obj.weather4Dest.temperature
    }
  }
})

// TODO: 根据查询到的返回的值机柜台位置，地图默认导航从当前位置到值机柜台的规划路径
</script>

<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search_success_wrap{
  height: 100%;
  padding: 80px 200px 166px;
  .inner_wrap{
    height: 100%;
    background-color: rgba($color: #fff, $alpha: .8);
    border-radius: 30px;
    box-shadow: -1px 7px 13px 0px rgba(37, 38, 38, 0.7);
    .title{
      line-height: 160px;
      font-size: 80px;
      border-bottom: 2px solid #00ddc9;
      font-weight: bold;
    }
    .content_wrap{
      height: calc(100% - 162px);
      padding: 40px 140px 106px;
      @include centerBox();
      .left_wrap{
        width: 65%;
        height: 100%;
        .title_wrap{
          display: flex;
          .img_wrap{
            height: 72px;
            img{
              height: 100%;
            }
          }
          .word{
            font-size: 72px;
            margin-left: 30px;
          }
        }
        .map_wrap{
          margin-top: 30px;
          height: calc(100% - 102px);
        }
      }
      .right_wrap{
        width: 34%;
        height: 100%;
        .word{
          font-size: 44px;
          text-align: left;
          padding-top: 30px;
        }
        .info_wrap{
          height: calc(100% - 100px);
          padding-top: 178px;
          margin-top: 30px;
          background-size: cover;
          background-image: url('../../../assets/images/55/flight_info_card_bg.png');
          .top{
            @include centerBox();
            padding: 0 40px;
            .place_wrap{
              width: 320px;
              .city{
                font-size: 84px;
                font-weight: 500;
                margin-top: 10px;
              }
              .airport{
                font-size: 40px;
                margin: 15px 0;
              }
              .weather{
                font-size: 32px;
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
              .img_wrap{
                width: 300px;
                img{
                  width: 100%;
                }
              }
              .no{
                font-size: 40px;
                margin-bottom: 20px;
              }
            }
          }
          .bottom{
            margin-top: 200px;
            padding: 0 120px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .item{
              width: 43%;
              margin-top: 100px;
              .label{
                font-size: 56px;
                color: #6C6B66;
                white-space: nowrap;
              }
              .value{
                font-size: 84px;
                color: #000000;
                margin-top: 60px;
              }
            }
          }
        }
      }
    }
  }
}
</style>