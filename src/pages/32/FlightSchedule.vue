<template>
  <Layout_32>
    <div class="flight_container">
      <div class="inner_wrap">
        <div class="top_wrap">
          <div class="btn" @click="depart">
            <div class="img_wrap" :class="{'selected':data.formData.direction === 'D'}">
              <img src="../../assets/images/55/depart.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.departure')}}</LoopTextContainer>
            </p>
          </div>
          <div class="img_wrap">
            <img src="../../assets/images/32/plane.png">
          </div>
          <div class="btn" @click="arrive">
            <div class="img_wrap" :class="{'selected':data.formData.direction === 'A'}">
              <img src="../../assets/images/55/arrive.png">
            </div>
            <div class="line"></div>
            <p class="name">
              <LoopTextContainer>{{$t('general.arrival')}}</LoopTextContainer>
            </p>
          </div>
        </div>
        <el-input
          v-model="data.formData.key"
          :placeholder="$t('subPage.flightSchedule.input')"
          @input="inputChange">
        </el-input>
        <!-- <div class="search_wrap">
          <el-select 
            v-model="flightDate"
            popper-class="select32_flight_date"
            @change="handleFlightDateChange">
            <el-option v-for="opt in getDayOpts()"
              :label="opt.label"
              :value="opt.value"
              :key="opt.value"></el-option>
          </el-select>
          <el-input
            class="input_wrap"
            v-model="data.formData.key"
            :placeholder="$t('subPage.flightSchedule.input')"
            @input="inputChange">
          </el-input>
        </div> -->
        <div class="flight_wrap_32">
          <FlightList
            :data="data.list"
            :direction="data.formData.direction"
            :loading="loading"
            @next="nextPage('msg32')">
          </FlightList>
        </div>
      </div>
    </div>
  </Layout_32>
</template>

<script lang="ts" setup>
import Layout_32 from '../../components/layout/Layout_32.vue'
import FlightList from '../../components/FlightList.vue'

import { onMounted } from 'vue'

import { useFlight } from '../../hooks/flight'

const { data, loading, getList, inputChange, nextPage, depart, arrive, getDayOpts, flightDate, handleFlightDateChange } = useFlight()
onMounted(() => {
  getList()
})

</script>

<style lang="scss" scoped>

.flight_container{
  height: 100%;
  padding: 0 35px 35px;
  :deep(.inner_wrap){
    height: 100%;
    box-shadow: -1px 7px 13px 0px rgba(37, 38, 38, 0.7);
    border-radius: 15px;
    padding: 35px;
    .top_wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn{
        width: 295px;
        height: 125px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #384048;
        border-radius: 15px;
        padding: 21px 35px;
        border: 2px solid #38F4FF;
        box-shadow: 0px 2px 24px 0px rgba(15, 34, 83, 0.47);
        .img_wrap{
          width: 80px;
          height: 80px;
          border-radius: 40px;
          border: 1px solid #fff;
          position: relative;
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
        .line{
          width: 0;
          height: 35px;
          border-left: 1px solid #00DDC9;
          margin-left: 35px;
          margin-right: 15px;
        }
        .name{
          width: 90px;
          font-size: 35px;
          color: #fff;
        }
        .active{
          color: #FFDE00;
        }
      }
    }
    .el-input{
      margin-top: 30px;
      .el-input__inner{
        height: 48px;
        line-height: 48px;
        font-size: 20px;
        border-radius: 24px;
        border: 1px solid #00ddc9;
        text-align: center;
      }
    }
    .search_wrap{
      margin-top: 30px;
      display: flex;
      .el-select--medium{
        .el-input__inner{
          height: 48px;
          line-height: 48px;
          font-size: 20px;
          border-radius: 24px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border: 1px solid #00ddc9;
          text-align: center;
        }
        .el-input__suffix{
          right: 10px;
          .el-input__icon{
            width: 20px;
            color: #00DDC9;
            svg{
              width: 3em;
              height: 3em ;
            }
          }
        }
      }
      .input_wrap{
        .el-input__inner{
          height: 48px;
          line-height: 48px;
          font-size: 20px;
          border-radius: 24px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border: 1px solid #00ddc9;
          border-left: none;
          text-align: center;
        }
      }
    }
    .flight_wrap_32{
      margin-top: 30px;
      height: calc(100% - 233px);
    }
  }
}
.el-popper.select32_flight_date{
  .el-select-dropdown__wrap{
    .el-select-dropdown__list{
      .el-select-dropdown__item{
        height: 44px;
        line-height: 44px;
        font-size: 19px;
        font-family: 'Univers';
      }
      .el-select-dropdown__item.selected{
        color: #00DDC9;
      }
    }
  }
}
</style>