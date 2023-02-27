<template>
  <div class="swiper_container">
    <div class="swiper_wrap">
      <el-carousel v-if="flag" arrow="always" height="420px" :autoplay="false" ref="carousel" :loop="false">
        <el-carousel-item v-for="(sItem, index) in swiperList.list" :key="index">
          <div class="shop_wrap">
            <div class="shop_item" v-for="s in sItem" :key="s.id" @click="showDetail(s)">
              <div class="img_wrap" v-if="s.logo">
                <img :src="prefixImg(s.logo)">
              </div>
              <div class="default_img" v-else>{{$t('general.noPic')}}</div>
              <p class="shop_name">{{s.name}}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <transition name="drop">
      <div class="show_detail_wrap" v-show="detailFlag" @click="detailFlag=false">
        <div class="img_wrap" v-if="data.detail.logo">
          <img :src="prefixImg(data.detail.logo)" alt="">
        </div>
        <div class="default_img" v-else>暂无图片</div>
        <div class="right_part">
          <div class="first_row">
            <p class="shop_name">{{data.detail.name}}</p>
            <p class="shop_type">{{data.detail.categoryCode}}</p>
          </div>
          <div class="second_row">
            <img src="../assets/images/32/location.png">
            <p class="position">{{data.detail.address}}</p>
            <!-- <p class="distance">{{data.detail.distance}}</p> -->
          </div>
          <div class="third_row">
            <p class="price">{{data.detail.price}}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, nextTick } from 'vue'
const props = defineProps({
  list: {
    type: Array as () => Array<any>,
    required: true
  }
})

/**
 * 根据传递过来的所有商铺list，按照每页显示n个的要求，进行重新分割数组
 */
const splitList = (arr: any[], n: number): any[] => {
  let result: any[] = []
  for(let i=0; i<arr.length; i += n) {
    result.push(arr.slice(i, i + n))
  }
  return result
}

const swiperList: any = reactive({
  list: []
})

// 当轮播图中carousel-item的数据是动态变化时，加载不出来，故设置一变量，当数据变化时，进行重新渲染
const flag = ref(false)

watch(() => props.list, (val, oldVal) => {
  flag.value = false
  swiperList.list = splitList(val, 10)
  nextTick(() => {
    flag.value = true
  })
})

let data = reactive({
  detail: {
    id: '',
    name: '',
    imgPath: '',
    type: '',
    position: '',
    distance: '',
    price: '',
    categoryCode: '',
    address: '',
    logo: ''
  }
})
const detailFlag = ref(false)

const showDetail = (s: any) => {
  detailFlag.value = true
  data.detail = s
}

const prefixImg = (base64: string): string => {
  return 'data:image/jpg;base64,' + base64
}
</script>

<style lang="scss" scoped>
.swiper_container{
  position: relative;
  :deep(.swiper_wrap){
    height: 420px;
    border-radius: 10px;
    padding: 0 50px;
    .el-carousel{
      .el-carousel__indicators{
        bottom: 15px;
        .el-carousel__indicator.is-active button {
          width: 20px;
        }
        .el-carousel__button{
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #00DDC9;
        }
      }
    }
  }
  .shop_wrap{
    display: flex;
    flex-wrap: wrap;
    .shop_item{
      width: 16%;
      margin: 0 2%;
      margin-bottom: 5px;
      padding-top: 15px;
      .img_wrap{
        width: 110px;
        height: 110px;
        border-radius: 55px;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
        img{
          height: 100%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .default_img{
        width: 110px;
        height: 110px;
        border-radius: 55px;
        background-color: #D6D8D9;
        color: #fff;
        font-size: 25px;
        line-height: 110px;
        margin: 0 auto;
      }
      .shop_name{
        font-size: 23px;
        margin-top: 10px;
        color: #000;
      }
    }
  }
  .show_detail_wrap{
    width: 662px;
    height: 226px;
    box-shadow: 0 2px 12px 0 #eee;
    border-radius: 10px;
    bottom: -250px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    position: absolute;
    margin-left: -331px;
    left: 50%;
    z-index: 9999999;
    background-image: url('../assets/images/32/shop_detail.png');
    background-size: cover;
    .img_wrap{
      width: 180px;
      height: 180px;
      overflow: hidden;
      position: relative;
      img{
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .default_img{
      width: 180px;
      height: 180px;
      padding: 40px;
      background-color: #D6D8D9;
      color: #fff;
      font-size: 40px;
      line-height: 1.2em;
    }
    .right_part{
      width: 430px;
      padding: 30px 10px;
      .first_row{
        display: flex;
        justify-content: space-between;
        .shop_name{
          width: 336px;
          font-size: 42px;
          text-align: left;
        }
        .shop_type{
          width: 60px;
          font-size: 24px;
          color: #4DACA2;
        }
      }
      .second_row{
        display: flex;
        align-items: flex-start;
        // justify-content: space-between;
        margin-top: 20px;
        img{
          width: 22px;
        }
        .position{
          font-size: 24px;
          margin-left: 15px;
          text-align: left;
        }
        .distance{
          font-size: 24px;
          margin-left: 30px;
        }
      }
      .third_row{
        margin-top: 20px;
        .price{
          text-align: left;
          font-size: 24px;
          color: #E60A0A;
        }
      }
    }
  }
}

</style>