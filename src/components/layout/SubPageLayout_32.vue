<template>
  <Layout_32>
    <div class="sub_page_container">
      <div class="inner_container">
        <div class="title" :style="props.style">
          <LoopTextContainer>{{props.title}}</LoopTextContainer>
        </div>
        <div class="inner_wrap">
          <slot></slot>
        </div>
      </div>
    </div>
  </Layout_32>
</template>

<script lang="ts" setup>
import Layout_32 from './Layout_32.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: {}
  }
})
</script>

<style lang="scss" scoped>
.sub_page_container{
  height: 100%;
  padding: 0 35px 35px;
  .inner_container{
    height: 100%;
    box-shadow: -1px 7px 13px 0px rgba(37, 38, 38, 0.7);
    border-radius: 15px;
    .title{
      height: 91px;
      font-size: 40px;
      font-weight: bold;
      padding: 0 25px;
      padding-top: 25px;
      border-bottom: 1px solid #00F4DE;
    }
    .inner_wrap{
      height: calc(100% - 91px);
      padding: 35px;
      background-image: url('../../assets/images/32/sub_bg.png');
      background-size: 100% 100%;
    }
  }
}
</style>