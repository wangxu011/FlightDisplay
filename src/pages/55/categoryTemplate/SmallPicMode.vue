<template>
  <SubPageLayout_55 :title="showRouteTitle" v-loading="loading">
    <el-scrollbar>
      <div class="mode_wrap">
        <div class="item_wrap">
          <div class="item" 
            v-for="(item, index) in data.list" 
            :key="index"
            @click="turnTo(item)">
            <div class="img_wrap">  
              <img :src="prefixImg(item.icon)">
            </div>
            <p class="title">{{item.title}}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      v-loading="dialogLoading"
      v-model="dialogVisible"
      width="1270px"
      top="6vh"
      custom-class="dialog55"
      :show-close="false">
      <p class="title55">{{dialogTitle}}</p>
      <div class="content_wrapper">
        <el-scrollbar>
          <div v-html="showHtml" class="ql-editor" v-if="contentType !== 'LINK'" style="height:100%"></div>
          <iframe :src="iframeSrc" style="height:100%" v-else></iframe>
        </el-scrollbar>
      </div>
      <template #footer>
        <div class="close" @click="dialogVisible=false"></div>
      </template>
    </el-dialog>
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import SubPageLayout_55 from '../../../components/layout/SubPageLayout_55.vue'

import { onMounted } from 'vue'

import { useCategory } from '../../../hooks/category'

const { loading, showRouteTitle, data, getDataForSmallMode, 
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg } = useCategory()

onMounted(() => {
  getDataForSmallMode()
})
</script>

<style lang="scss" scoped>
.mode_wrap{
  height: 100%;
  padding: 50px 150px;
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 32%;
      height: 360px;
      background-color: #E2F6F6;
      border-radius: 30px;
      padding-top: 60px;
      margin-bottom: 55px;
      .img_wrap{
        width: 150px;
        height: 150px;
        position: relative;
        margin: 0 auto;
        overflow: hidden;
        img{
          height: 100%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .title{
        font-size: 68px;
        color: #3A4244;
        margin-top: 30px;
      }
    }
    .item:nth-of-type(3n+2){
      margin: 0 2%;
    }
  }
}
</style>