<template>
  <SubPageLayout_55 :title="$t('subPage.flightSchedule.title')">
    <div class="flight_schedule_container">
      <div class="inner_wrap">
        <el-input
          v-model="data.formData.key"
          :placeholder="$t('subPage.flightSchedule.input')"
          @input="inputChange">
        </el-input>
        <div class="main_wrap">
          <div class="side_wrap">
            <div class="btn" @click="depart">
              <div class="img_wrap" :class="{'selected':data.formData.direction === 'D'}">
                <img src="../../assets/images/55/depart.png">
              </div>
              <hr color="#00F4DE" />
              <p class="name">
                <LoopTextContainer>{{$t('general.departure')}}</LoopTextContainer>
              </p>
            </div>
            <div class="btn" @click="arrive">
              <div class="img_wrap" :class="{'selected':data.formData.direction === 'A'}">
                <img src="../../assets/images/55/arrive.png">
              </div>
              <hr color="#00F4DE" />
              <p class="name">
                <LoopTextContainer>{{$t('general.arrival')}}</LoopTextContainer>
              </p>
            </div>
          </div>
          <div class="flight_wrap_55">
            <FlightList
              :data="data.list"
              :direction="data.formData.direction"
              :loading="loading"
              @next="nextPage('msg55')">
            </FlightList>
          </div>
        </div>
      </div>
    </div>
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import SubPageLayout_55 from '../../components/layout/SubPageLayout_55.vue'
import FlightList from '../../components/FlightList.vue'

import { onMounted } from 'vue'

import { useFlight } from '../../hooks/flight'
const { data, loading, getList, inputChange, nextPage, depart, arrive } = useFlight()

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.flight_schedule_container{
  height: 100%;
  :deep(.inner_wrap){
    height: 100%;
    padding: 40px;
    background: #f1f4f8;
    box-shadow: -2px 14px 26px 0px rgba(37, 38, 38, 0.7);
    // opacity: 0.8;
    border-radius: 30px;
    .el-input{
      .el-input__inner{
        height: 94px;
        line-height: 94px;
        font-size: 34px;
        border-radius: 47px;
        border: 2px solid #00ddc9;
        text-align: center;
      }
    }
    .main_wrap{
      margin-top: 40px;
      height: calc(100% - 134px);
      display: flex;
      justify-content: space-between;
      .side_wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .btn{
          width: 384px;
          height: 49%;
          background-color: #384048;
          border-radius: 30px;
          padding: 44px;
          .img_wrap{
            width: 200px;
            height: 200px;
            border-radius: 100px;
            border: 2px solid #fff;
            margin: 0 auto;
            position: relative;
            margin-bottom: 60px;
            background-color: #DBDBDB;
            img{
              width: 70%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .selected{
            background-color: #FFDE00;
          }

          .name{
            font-size: 90px;
            color: #fff;
            margin-top: 60px;
          }
          .active{
            color: #FFDE00;
          }
        }
      }
      .flight_wrap_55{
        width: calc(100% - 424px);
        height: 100%;
      }
    }
  }
}
</style>