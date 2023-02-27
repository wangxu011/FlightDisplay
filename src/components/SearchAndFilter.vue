<template>
  <div class="search_filter_wrap">
    <!-- tab切换分类 -->
    <div class="tab_wrap" v-if="showTab">
      <el-icon :size="50" color="#fff" @click="showTab=false">
        <search />
      </el-icon>
      <div class="category_wrap">
        <el-tabs v-model="tabModel">
          <el-tab-pane 
            v-for="item in props.categoryList" 
            :key="item.value"
            :name="item.value"
            :label="item.name">
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 模糊查询input -->
    <div class="fuzzy_search_wrap" v-else>
      <el-icon :size="50" color="#fff" @click="showTab=true">
        <arrow-left />
      </el-icon>
      <el-input v-model="searchVal" :placeholder="$t('general.input')"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  categoryList: {
    type: Array as () => Array<any>,
    required: true
  }
})

const tabModel = ref('0')

// input - model
const searchVal = ref('')

const showTab = ref(true)
</script>

<style lang="scss" scoped>
.search_filter_wrap{
  .tab_wrap{
    display: flex;
    align-items: center;
    .el-icon{
      margin-right: 30px;
    }
  }
  :deep(.fuzzy_search_wrap){
    display: flex;
    align-items: center;
    .el-icon{
      margin-right: 20px;
    }
    .el-input{
      .el-input__inner{
        height: 60px;
        line-height: 60px;
        font-size: 32px;
      }
    }
  }
}
</style>