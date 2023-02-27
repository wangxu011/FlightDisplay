<template>
  <div class="item1" @click="turnTo" :style="props.layout">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/7.png" alt="">
    </div>
    <p class="label">{{$t('subPage.moreService.title')}}</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { _getCategoryByLabel } from '../../../axios/api/categoryController'
import { categoryMap } from '../../../utils/generalMap'
import { createMsg } from '../../../utils/message'

const props = defineProps({
  layout: {
    type: Object
  }
})

// 栏目渲染的模板类型：NO_PIC SMALL_PIC BIG_PIC COMPOSED
const type = ref('')

const label = '更多服务'

onMounted(() => {
  // 获取 “旅客服务” 对应的模式，然后跳转至对应的渲染模板，并传递label
  _getCategoryByLabel(label).then(res => {
    console.log(res)
    if(res.value) {
      type.value = res.value.module
    }
  })
})

const { t } = useI18n() 
const router = useRouter()
const turnTo = () => {
  if(type.value) {
    router.push(`${categoryMap[type.value]}?label=${label}&id=`)
  }else {
    createMsg('warning', t('general.noData'), 'msg32')
  }
}
</script>

<style lang="scss" scoped>
</style>