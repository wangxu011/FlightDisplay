<template>
  <SubPageLayout_32 :title="$t('subPage.airportMap.title')">
    <div class="map_wrap">
      <OpenLayer :name="destName"></OpenLayer>
      <!-- <TestOpenLayer></TestOpenLayer> -->
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import SubPageLayout_32 from '../../components/layout/SubPageLayout_32.vue'

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const destName = ref('')
onMounted(() => {
  if(route.query.destName) {
    destName.value = String(route.query.destName)
  }
})
</script>

<style lang="scss" scoped>
.map_wrap{
  height: 100%;
}
</style>