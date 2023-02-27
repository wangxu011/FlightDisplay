<template>
  <div class="shop_list_wrapper" v-load-more="123">
    <div class="shop_list_container">
      <div class="item"
        v-for="item in props.shopList"
        @click="select(item)"
        :key="item.id">
        <div class="img_wrap" v-if="item.logo">
          <img :src="prefixImg(item.logo)">
        </div>
        <div class="default_img" v-else>{{$t('general.noPic')}}</div>
        <p class="name">{{item.name}}</p>
        <p class="bottom_wrap">
          <img src="../../assets/images/32/location.png">
          <span class="address">{{item.address}}</span>
          <!-- <span class="distance">{{item.distance}}</span> -->
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  shopList: {
    type: Object as () => Array<any>,
    required: true
  }
})

const emit = defineEmits(['next',  'detail'])
const nextPage = () => {
  emit('next')
}

const select = (item: any) => {
  emit('detail', item.poiId)
}

// 节流处理timer
let timer: any = null
// 自定义指令 - 给el-table添加滚动事件的监听
const vLoadMore = {
  mounted: (el, binding) => {
    let prevScrollTop = 0
    const listWrap = document.querySelector('.shop_list_wrapper')
    listWrap?.addEventListener('scroll', () => {
      // scrollHeight：整个list容器的总高度
      // clientHeight：视窗高度
      // scrollTop：滚动高
      // 在距离页面底部还剩50px的时候加载下一页数据，添加节流处理
      if((listWrap.scrollHeight - listWrap.clientHeight - listWrap.scrollTop) < 50) {
        const currentScrollTop = listWrap.scrollTop
        if(!timer && (currentScrollTop > prevScrollTop)) {
          timer = setTimeout(() => {
            console.log('next page')
            nextPage()
            timer = null
          }, 500)
        }
      }
      prevScrollTop = listWrap.scrollTop
    })
  }
}

const prefixImg = (base64: string): string => {
  return 'data:image/jpg;base64,' + base64
}
</script>

<style lang="scss" scoped>
.shop_list_wrapper{
  height: 100%;
  padding: 5px;
  overflow-y: scroll;
  .shop_list_container{
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 32%;
      height: 306px;
      margin-bottom: 2%;
      padding-top: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px 0 rgba(143, 184, 184, 0.3);
      .img_wrap{
        margin: 0 auto;
        width: 150px;
        height: 150px;
        border-radius: 75px;
        position: relative;
        overflow: hidden;
        img{
          height: 100%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .default_img{
        margin: 0 auto;
        width: 150px;
        height: 150px;
        border-radius: 75px;
        font-size: 28px;
        line-height: 150px;
        color: #fff;
        background-color: #D6D8D9;
      }
      .name{
        font-size: 40px;
        margin-top: 10px;
        margin-bottom: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bottom_wrap{
        font-size: 28px;
        color: #000;
        display: flex;
        align-items: center;
        padding-left: 45px;
        img{
          width: 25px;
        }
        .address{
          flex: auto;
          text-align: left;
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .distance{
          margin-left: 15px;
        }
      }
    }
    .item:nth-of-type(3n+2){
      margin: 0 2%;
    }
  }
}
</style>