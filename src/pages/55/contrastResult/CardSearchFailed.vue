<template>
  <SubPageLayout_55 :title="$t('tip.cardSearchFailed55')">
    <div class="card_search_failed_wrap">
      <div class="flight_wrap_55">
        <FlightList
          :data="data.list"
          direction="D"
          :loading="loading"
          @next="nextPage">
        </FlightList>
      </div>
    </div>
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import SubPageLayout_55 from '../../../components/layout/SubPageLayout_55.vue'
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
  .flight_wrap_55{
    height: 100%;
  }
}
</style>