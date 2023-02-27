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

  const loading = ref(false)

  const store = useStore()
  /* 搜索条件表单数据 */
  const formData: any = reactive({
    terminal: '',
    floor: '',
    area: '',
    name: '',
    categoryPrefix: '',
    page: 0
  })

  /* swiper组件 */
  const shopList: any = reactive({
    data: []
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
      tabModel.value = res.value.subCategories[0].name
      formData.categoryPrefix = tabModel.value
    }
    getData()
  }

  const getData = () => {
    loading.value = true
    _queryShops(formData).then(res => {
      console.log('shops: ', res)
      shopList.data = res.value.results
      if(res.value.results.length === 0)
        createMsg('warning', t('tip.searchNoShop'), 'msg55')
    }).finally(() => {
      loading.value = false
    })
  }

  // select切换时触发搜索
  const handleSelect = (e) => {
    formData.page = 0
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
      formData.page = 0
      getData()
    }, 600)
  }

  const tabClick = (e) => {
    formData.page = 0
    formData.categoryPrefix = e.paneName
    getData()
  }

  // 滚动触发获取下一页数据
  const nextPage = () => {
    loading.value = true
    formData.page ++
    _queryShops(formData).then(res => {
      console.log('shops: ', res)
      if(res.value.results.length === 0 ) {
        createMsg('warning', t('tip.loadAll'), 'msg55')
        return
      }
      shopList.data = shopList.data.concat(res.value.results)
    }).finally(() => {
      loading.value = false
    })
  }

  const poiId = ref('')
  const getPoiId = (id) => {
    poiId.value = id
    console.log('poiId: ', poiId.value)
  }


  return { loading, formData, shopList, tabModel, tabList, poiId,
    init, getData, handleSelect, inputChange, tabClick, nextPage, getPoiId }
}