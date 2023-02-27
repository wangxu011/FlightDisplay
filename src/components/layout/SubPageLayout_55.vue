<template>
  <Layout_55>
    <div class="sub_page_container">
      <div class="inner_container">
        <div class="title">
          <div class="back_wrap" @click="back">
            <el-icon :size="80" color="#7D8286">
              <arrow-left />
            </el-icon>
            <span class="word">{{$t('general.back')}}</span>
          </div>
          <LoopTextContainer> 
            <span>{{props.title}}</span>
          </LoopTextContainer>
        </div>
        <div class="inner_wrap">
          <slot></slot>
        </div>
      </div>
    </div>
  </Layout_55>
</template>

<script lang="ts" setup>
import Layout_55 from './Layout_55.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const back = () => {
  router.go(-1)
}

</script>

<style lang="scss" scoped>
.sub_page_container{
  height: 100%;
  padding: 80px 200px 166px;
  .inner_container{
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 30px;
    box-shadow: -1px 7px 13px 0px rgb(37 38 38 / 70%);
    .title{
      height: 162px;
      line-height: 160px;
      font-size: 80px;
      border-bottom: 2px solid #00ddc9;
      font-weight: bold;
      position: relative;
      padding: 41px 140px 0 270px;
      .back_wrap{
        position: absolute;
        left: 60px;
        top: 40px;
        display: flex;
        align-items: center;
        .word{
          font-size: 48px;
          color: #7D8286;
          margin-left: 10px;
        }
      }
    }
    .inner_wrap{
      height: calc(100% - 162px);
      padding: 40px 140px 140px;
    }
  }
}
</style>