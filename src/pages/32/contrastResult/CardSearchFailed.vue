<template>
  <SubPageLayout_32
    :title="$t('tip.cardSearchFailed32')"
    :style="{fontSize: '28px'}">
    <div class="card_search_failed_wrap">
      <div class="flight_wrap_32">
        <FlightList
          :data="data.list"
          direction="D"
          :loading="loading"
          @next="nextPage"
          />
      </div>
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import SubPageLayout_32 from '../../../components/layout/SubPageLayout_32.vue'
import FlightList from '../../../components/FlightList.vue'

import { useFlight } from '../../../hooks/flight'

const { data, loading, getList, nextPage } = useFlight()

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.card_search_failed_wrap{
  height: 100%;
  .flight_wrap_32{
    height: 100%;
  }
}
</style>