<template>
  <div class="item_55" @click="turnTo" :style="{width: props.width}">
    <div class="img_wrap">
      <img src="../../../assets/images/55/routes/6.png">
    </div>
    <hr color="#00F4DE" />
    <div class="name_wrap">
      <p :class="currentLang==='CN'?'cn':'en'">{{$t('subPage.shopping.title')}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  width: {
    type: String,
    default: '346px'
  }
})
const router = useRouter()
const turnTo = () => {
  router.push('/Shopping/55')
}

const { locale } = useI18n()
const currentLang = computed(() => {
  return locale.value
})
</script>

<style lang="scss" scoped>
</style>