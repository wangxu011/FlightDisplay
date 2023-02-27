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
            <p class="discription">{{item.value}}</p>
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

const { loading, showRouteTitle, data, getData,
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg } = useCategory()

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.mode_wrap{
  height: 100%;
  padding: 50px;
  .item_wrap{
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    .item{
      width: 32%;
      border-radius: 30px;
      box-shadow: -1px 7px 13px 0px rgb(37 38 38 / 50%);
      margin-bottom: 50px;
      .img_wrap{
        width: 100%;
        height: 380px;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
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
        font-size: 48px;
        color: #384048;
        margin-top: 22px;
        text-align: left;
        padding-left: 34px;
        padding-right: 10px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .discription{
        height: 86px;
        padding: 30px 34px;
        line-height: 26px;
        font-size: 26px;
        color: #868686;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item:nth-of-type(3n+2){
      margin: 0 2%;
    }
  }
}
</style>