<template>
  <SubPageLayout_32 :title="showRouteTitle" v-loading="loading">
    <el-scrollbar>
      <div class="mode_wrap">
        <div class="item_wrap">
          <div class="item" 
            v-for="(item, index) in data.list" 
            :key="index"
            @click="turnTo(item)"
            :style="{backgroundImage: `url(${imgArr[index%8]})`}">
            <p class="label">{{item.title}}</p>
            <p class="value" v-if="item.type==='TEL'">{{item.value}}</p>
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

import _1 from '../../../assets/images/no_pic_mode/1.png'
import _2 from '../../../assets/images/no_pic_mode/2.png'
import _3 from '../../../assets/images/no_pic_mode/3.png'
import _4 from '../../../assets/images/no_pic_mode/4.png'
import _5 from '../../../assets/images/no_pic_mode/5.png'
import _6 from '../../../assets/images/no_pic_mode/6.png'
import _7 from '../../../assets/images/no_pic_mode/7.png'
import _8 from '../../../assets/images/no_pic_mode/8.png'

// 将所有背景图放到数组中，方便模板中动态使用
const imgArr = [_1, _2, _3, _4, _5, _6, _7, _8]

const { loading, showRouteTitle, data, getData,
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo } = useCategory()

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.mode_wrap{
  height: 100%;
  padding: 50px;
  .item_wrap{
    .item{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      height: 111px;
      border-radius: 12px;
      box-shadow: 0px 0px 17px 0px rgba(0, 244, 222, 0.48);
      background-size: cover;
      margin-bottom: 39px;
      padding: 10px 30px;
      padding-left: 58px;
      .label{
        font-size: 35px;
        color: #161A1A;
        width: 68%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
      }
      .value{
        font-size: 28px;
        color: #16999E;
        width: 58%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
      }
    }
  }
}
</style>