<template>
  <SubPageLayout_32 :title="$t('subPage.scanCard.passportQuery')"
    v-loading="store.state.cardScanning"
    element-loading-background="rgba(0,0,0,.5)">
    <p class="tip">{{$t('tip.putPassport')}}</p>
    <div class="img_wrap">
      <img src="../../../assets/images/32/gif/2.gif">
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import SubPageLayout_32 from '../../../components/layout/SubPageLayout_32.vue'
import { useStore } from 'vuex'
import { onUnmounted } from 'vue'

const store = useStore()
onUnmounted(() => {
  store.commit('SET_CARD_SCANNING', false)
})
</script>

<style lang="scss" scoped>
.tip{
  margin-top: 300px;
  font-size: 30px;
  font-weight: bold;
}
.img_wrap{
  height: 400px;
  margin-top: 50px;
  img{
    height: 100%;
  }
}
</style>