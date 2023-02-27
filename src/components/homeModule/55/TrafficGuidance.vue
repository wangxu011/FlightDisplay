<template>
  <div class="item_55" @click="turnTo" :style="{width: props.width}">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/8.png">
    </div>
    <hr color="#00F4DE" />
    <div class="name_wrap">
      <p :class="currentLang==='CN' ? 'cn' : 'en'">{{$t('subPage.trafficService.title')}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { _getCategoryByLabel } from '../../../axios/api/categoryController'
import { categoryMap } from '../../../utils/generalMap'
import { createMsg } from '../../../utils/message'

const props = defineProps({
  width: {
    type: String,
    default: '346px'
  }
})

// 栏目渲染的模板类型：NO_PIC LITTLE_PIC BIG_PIC COMPOSED
const type = ref('')

const label = '交通服务'

onMounted(() => {
  // 获取 “交通交通服务” 对应的模式，然后跳转至对应的渲染模板，并传递label
  _getCategoryByLabel(label).then(res => {
    console.log(res)
    if(res.value) {
      type.value = res.value.module
    }
  })
})

const router = useRouter()
const turnTo = () => {
  if(type.value) {
    router.push(`${categoryMap[type.value]}/55?label=${label}&id=`)
  }else {
    createMsg('warning', t('general.noData'), 'msg55')
  }
}

const { t, locale } = useI18n()
const currentLang = computed(() => {
  return locale.value
})
</script>

<style lang="scss" scoped>
</style>