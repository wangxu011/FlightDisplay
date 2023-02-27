<template>
  <SubPageLayout_32 :title="$t('subPage.shopping.title')">
    <div class="food_wrap">
      <div class="search_wrap">
        <el-form
          :inline="true"
          :model="formData"
          class="search_form">
          <div>
            <el-form-item>
              <el-select v-model="formData.terminal" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select32">
                <el-option v-for="opt in terminalOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formData.floor" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select32">
                <el-option v-for="opt in floorOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formData.area" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select32">
                <el-option v-for="opt in areaOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item :style="{marginRight:0}">
              <el-input class="exact-input" 
                v-model="formData.name" 
                :prefix-icon="Search" 
                :placeholder="$t('general.input')"
                @input="inputChange">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="middle_wrap" v-loading="loading">
        <div class="category_wrap">
          <el-tabs @tab-click="tabClick" v-model="tabModel">
            <el-tab-pane
              v-for="item in tabList.data" 
              :key="item.id"
              :name="item.prefix"
              :label="item.name">
            </el-tab-pane>
          </el-tabs>
        </div>
        <ShopLoop
          @detail="getPoiId"
          @next="getOnePageData"
          :list="swiperList.data"
          :onePageList="swiperList.onePageData"
          :total="total"
          v-show="swiperList.data.length > 0">
        </ShopLoop>
        <div class="no_data" v-show="swiperList.data.length === 0">{{$t('general.noData')}}</div>
      </div>
      <div class="map_wrap">
        <OpenLayer :poiId="poiId"></OpenLayer>
        <!-- <TestOpenLayer></TestOpenLayer> -->
      </div>
    </div>
  </SubPageLayout_32>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import SubPageLayout_32 from '../../components/layout/SubPageLayout_32.vue'
import ShopLoop from '../../components/ShopLoop.vue'
import OpenLayer from '../../components/OpenLayer.vue'

import { terminalOpts, floorOpts, areaOpts } from '../../utils/options'

import { Search } from '@element-plus/icons'

import { useShop } from '../../hooks/shop_for_32'

const { loading, formData, swiperList, tabModel, tabList, total, poiId,   
    init, handleSelect, inputChange, tabClick, getOnePageData, getPoiId } = useShop()

onMounted(() => {
  init('购物')
})

</script>

<style lang="scss" scoped>
@mixin centerBox() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.food_wrap{
  height: 100%;
  :deep(.search_wrap){
    .el-form{
      display: flex;
      justify-content: space-between;
      .el-form-item{
        // select样式修改
        .el-select{
          width: 200px;
          .el-input__inner{
            font-size: 19px;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
            border: 1px solid #00ddc9;
            padding: 0 15px;
            padding-right: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #CDD3D6;
          }
          .el-input__suffix{
            right: 10px;
            .el-input__icon{
              width: 20px;
              color: #6C6B66;
              svg{
                width: 3em;
                height: 3em ;
              }
            }
          }
          .el-input__inner::-webkit-input-placeholder{
            color: #6C6B66;
          }
          // el-tags
          .el-select__tags{
            padding-left: 10px;
            .el-tag{
              font-size: 16px;
              // 此处的高度不与字体大小相同，否则在select中的显示会有奇怪的 “短线” 出现
              height: 30px !important;
              line-height: 30px !important;
              .el-select__tags-text{
                max-width: 150px !important;
              }
              // 小×的样式
              .el-icon{
                width: 16px;
                height: 16px;
                font-size: 16px;
              }
            }
          }
        }
        // input样式修改
          .exact-input{
          width: 230px;
          .el-input__inner{
            font-size: 19px;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
            border: 1px solid #00ddc9;
            padding: 0 10px;
            background-color: #CDD3D6;
            padding-left: 40px;
          }
          .el-input__prefix{
            left: 13px;
            .el-input__icon{
              width: 20px;
              color: #6C6B66;
              svg{
                width: 6em;
                height: 6em ;
              }
            }
          }
          .el-input__inner::-webkit-input-placeholder{
            color: #6C6B66;
          }
        }
      }
    }
  }
  .middle_wrap{
    border-radius: 15px;
    background-color: #fff;
    box-shadow: -1px 5px 13px 0px rgba(37, 38, 38, 0.3);
    :deep(.category_wrap){
      padding: 0 100px;
      .el-tabs{
        height: 50px;
        .el-tabs__header{
          margin-bottom: 0;
          .el-tabs__nav-prev, .el-tabs__nav-next {
            line-height: 60px;
            .el-icon{
              font-size: 20px;
            }
          }
        }
        .el-tabs__item{
          min-width: 130px;
          height: 50px;
          line-height: 50px;
          color: #B2B2B2;
          font-size: 18px;
        }
        .el-tabs__item.is-active{
          color: #00ddc9;
          font-weight: bold;
        }
        .el-tabs__active-bar{
          height: 5px;
          background-color: #00ddc9;
        }
        // 修改el-tabs的最下面的横线的颜色
        // .el-tabs__nav-wrap::after{
          // background-color: orange;
        // }
      }
    }
    .no_data{
      height: 420px;
      font-size: 40px;
      line-height: 420px;
    }
  }
  .map_wrap{
    height: calc(100% - 551px);
    margin-top: 25px;
  }
}
</style>