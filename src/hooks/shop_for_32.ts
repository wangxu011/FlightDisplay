/**
 * 商铺（美食、购物）相关方法及相应数据
 */

import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { _queryCategoriesByLabel, _queryShops } from '../axios/api/businessController'
import { createMsg } from '../utils/message'

export const useShop = () => {

  const { t } = useI18n()

  const total = ref(0)

  const loading = ref(false)

  const store = useStore()
  /* 搜索条件表单数据 */
  const formData: any = reactive({
    terminal: '',
    floor: '',
    area: '',
    name: '',
    categoryPrefix: '',
    page: 0,
    size: 20
  })

  /* swiper组件 */
  const swiperList: any = reactive({
    data: [],
    onePageData: []
  })

  /* tab组件 */
  const tabModel = ref('')
  const tabList: any = reactive({
    data: []
  })

  /**
   * 初始化函数
   * @param category: "美食" / "购物"
   */
  const init = async (category: string) => {
    loading.value = true
    // 获取 "美食" / "购物" 下面的所有分类，默认选中第一个子分类
    const res = await _queryCategoriesByLabel(category)
    if(res.code === 200) {
      tabList.data = res.value.subCategories
      tabModel.value = res.value.subCategories[0].prefix
      formData.categoryPrefix = tabModel.value
    }
    getData()
  }

  const getData = () => {
    loading.value = true
    _queryShops(formData).then(res => {
      total.value = res.value.total
      swiperList.data = res.value.results
      if(res.value.results.length === 0)
        createMsg('warning', t('tip.searchNoShop'), 'msg32')
    }).finally(() => {
      loading.value = false
    })
  }

  // select切换时触发搜索
  const handleSelect = (e) => {
    getData()
  }

  // 搜索框值的变化触发，防抖延时为1000ms
  let timer: any = null
  const inputChange = (e) => {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      formData.name = e
      getData()
    }, 600)
  }

  const tabClick = (e) => {
    formData.categoryPrefix = e.paneName
    getData()
  }

  const getOnePageData = (page) => {
    const obj = {
      terminal: formData.terminal,
      floor: formData.floor,
      area: formData.aera,
      name: formData.name,
      categoryPrefix: formData.categoryPrefix,
      page,
      size: 10
    }
    _queryShops(obj).then(res => {
      swiperList.onePageData = res.value.results
    })
  }

  const poiId = ref('')
  const getPoiId = (id) => {
    poiId.value = id
    console.log('poiId: ', poiId.value)
  }

  // 获取设备的POI坐标
  const poi = [store.state.innateProperties.x, store.state.innateProperties.y]

  return { loading, formData, swiperList, tabModel, tabList, total, poiId, 
    init, getData, handleSelect, inputChange, tabClick, getOnePageData, getPoiId }
}