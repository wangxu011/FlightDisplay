<template>
  <SubPageLayout_55 :title="$t('subPage.shopping.title')">
    <div class="food_wrap">
      <div class="top_wrap">
        <div class="title_wrap">
          <div class="img_wrap">
            <img src="../../assets/images/55/map_logo.png">
          </div>
          <p class="word">{{$t('general.shopMap')}}</p>
        </div>
        <div class="search_wrap">
          <el-form
            :inline="true"
            :model="formData"
            class="search_form">
            <el-form-item>
              <el-select v-model="formData.terminal" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select55">
                <el-option v-for="opt in terminalOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formData.floor" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select55">
                <el-option v-for="opt in floorOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formData.area" @change="handleSelect" :placeholder="$t('general.select')" popper-class="select55">
                <el-option v-for="opt in areaOpts" :label="$t(opt.label)" :value="opt.value" :key="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :style="{marginRight:0}">
              <el-input class="exact-input" @input="inputChange" v-model="formData.name" :prefix-icon="Search" :placeholder="$t('general.input')"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="bottom_wrap">
        <div class="map_container">
          <!-- <TestOpenLayer></TestOpenLayer> -->
          <OpenLayer :poiId="poiId"></OpenLayer>
        </div>
        <div class="shop_container" v-loading="loading">
          <div class="category_wrap">
            <el-tabs v-model="tabModel" @tab-click="tabClick">
              <el-tab-pane 
                v-for="item in tabList.data" 
                :key="item.id"
                :name="item.prefix"
                :label="item.name">
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="list_wrap" v-if="shopList.data.length > 0">
            <ShopList 
              :shopList="shopList.data" 
              @next="nextPage"
              @detail="getPoiId">
            </ShopList>
          </div>
          <div class="no_data" v-else>{{$t('general.noData')}}</div>
        </div>
      </div>
    </div>
  </SubPageLayout_55>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import SubPageLayout_55 from '../../components/layout/SubPageLayout_55.vue'
import ShopList from '../../components/55/ShopList.vue'
import Iframe from '../../components/Iframe.vue'
import TestOpenLayer from '../../components/TestOpenLayer.vue'
import OpenLayer from '../../components/OpenLayer.vue'

import { terminalOpts, floorOpts, areaOpts } from '../../utils/options'

import { Search } from '@element-plus/icons'

import { useShop } from '../../hooks/shop_for_55'

const { loading, formData, shopList, tabModel, tabList, poiId,
    init, handleSelect, inputChange, tabClick, nextPage, getPoiId } = useShop()

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
  .top_wrap{
    @include centerBox();
    .title_wrap{
      @include centerBox();
      .img_wrap{
        height: 72px;
        img{
          height: 100%;
        }
      }
      .word{
        font-size: 72px;
        margin-left: 30px;
      }
    }
    :deep(.search_wrap){
      .el-form{
        .el-form-item{
          margin-right: 40px;
          // select样式修改
          .el-select{
            width: 440px;
            .el-input__inner{
              font-size: 40px;
              height: 90px;
              line-height: 90px;
              border-radius: 45px;
              border: 2px solid #00ddc9;
              padding: 0 30px;
              padding-right: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              background-color: #CDD3D6;
            }
            .el-input__suffix{
              right: 27px;
              .el-input__icon{
                width: 50px;
                color: #6C6B66;
                svg{
                  width: 6em;
                  height: 6em;
                }
              }
            }
            .el-input__inner::-webkit-input-placeholder{
              color: #6C6B66;
            }
            // el-tags
            .el-select__tags{
              padding-left: 20px;
              .el-tag{
                font-size: 40px;
                // 此处的高度不与字体大小相同，否则在select中的显示会有奇怪的 “短线” 出现
                height: 70px !important;
                line-height: 70px !important;
                .el-select__tags-text{
                  max-width: 170px !important;
                }
                // 小×的样式
                .el-icon{
                  width: 48px;
                  height: 38px;
                  font-size: 34px;
                }
              }
            }
          }
          // input样式修改
          .exact-input{
            width: 956px;
            .el-input__inner{
              font-size: 40px;
              height: 90px;
              line-height: 90px;
              border-radius: 45px;
              border: 2px solid #00ddc9;
              padding: 0 30px;
              background-color: #CDD3D6;
              padding-left: 90px;
            }
            .el-input__prefix{
              left: 27px;
              .el-input__icon{
                width: 50px;
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
  }
  .bottom_wrap{
    margin-top: 20px;
    height: calc(100% - 132px);
    @include centerBox();
    .map_container{
      width: calc(100% - 1476px);
      height: 100%;
      border-radius: 20px;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .shop_container{
      width: 1436px;
      height: 100%;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 40px 40px 0;
      :deep(.category_wrap){
        .el-tabs{
          height: 80px;
          .el-tabs__header{
            margin-bottom: 0;
            .el-tabs__nav-prev, .el-tabs__nav-next {
              .el-icon{
                font-size: 60px;
              }
            }
          }
          .el-tabs__item{
            min-width: 200px;
            height: 80px;
            color: #B2B2B2;
            font-size: 34px;
          }
          .el-tabs__item.is-active{
            color: #00ddc9;
            font-weight: bold;
          }
          .el-tabs__active-bar{
            height: 4px;
            background-color: #00ddc9;
          }
          // 修改el-tabs的最下面的横线的颜色
          // .el-tabs__nav-wrap::after{
            // background-color: orange;
          // }
        }
      }
      .list_wrap{
        margin-top: 30px;
        height: calc(100% - 110px);
      }
      .no_data{
        font-size: 80px;
        line-height: 10em;
      }
    }
  }
}
</style>