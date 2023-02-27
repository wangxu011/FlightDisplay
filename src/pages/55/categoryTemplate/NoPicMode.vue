<template>
  <SubPageLayout_55 :title="showRouteTitle" v-loading="loading">
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item{
      width: 49%;
      height: 220px; 
      padding: 40px 116px;
      border-radius: 24px;
      background-size: cover;
      box-shadow: 0px 0px 35px 0px rgba(0, 244, 222, 0.48);
      margin-bottom: 65px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .label{
        width: 75%;
        font-size: 70px;
        color: #161A1A;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
      }
      .value{
        width: 50%;
        font-size: 56px;
        color: #16999E;
        margin-top: 15px;
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