<template>
  <SubPageLayout_32 :title="showRouteTitle" v-loading="loading">
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
            <p class="discription">{{item.value}}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      v-loading="dialogLoading"
      v-model="dialogVisible"
      width="888px"
      custom-class="dialog32"
      :show-close="false">
      <p class="title32">{{dialogTitle}}</p>
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
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import SubPageLayout_32 from '../../../components/layout/SubPageLayout_32.vue'

import { onMounted } from 'vue'

import { useCategory } from '../../../hooks/category'

const { loading, showRouteTitle, data, getData,
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg } = useCategory()

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.mode_wrap{
  height: 100%;
  padding: 40px;
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    .item{
      width: 48%;
      border-radius: 15px;
      box-shadow: -1px 7px 13px 0px rgb(37 38 38 / 50%);
      margin-bottom: 30px;
      .img_wrap{
        width: 100%;
        height: 200px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        font-size: 0;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        img{
          width: 100%;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      .title{
        font-size: 28px;
        color: #384048;
        margin-top: 15px;
        text-align: left;
        padding-left: 20px;
        padding-right: 10px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .discription{
        height: 52px;
        padding: 15px 20px;
        line-height: 22px;
        font-size: 15px;
        color: #868686;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>