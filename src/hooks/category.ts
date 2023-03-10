/**
 * 栏目、富文本相关方法及相应数据
 */

import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { _getCategoryByLabel, _getCategoryById, _getRichTextById } from '../axios/api/categoryController'

import { categoryMap } from '../utils/generalMap'
import { createMsg } from '../utils/message'

export const useCategory = () => {

  const route = useRoute()
  const router = useRouter()

  const { t, locale } = useI18n()
  
  const loading = ref(false)
  const showRouteTitle = ref('')
  const data: any = reactive({
    list: []
  })

  // 判断设备类型: 55寸 / 32寸
  const if55 = route.path.split('/').indexOf('55') != -1

  /**
   * 获取数据时，需获取对应富文本，适用 “无图模式” 与 “大图模式”
   */
  const getData = () => {
    // 如果label存在，则通过getByLabel调用
    // 否则使用getById进行调用
    if(route.query.label) {
      loading.value = true
      _getCategoryByLabel(String(route.query.label)).then(async res => {
        if(res.value) {
          showRouteTitle.value = res.value.title
          data.list = await Promise.all(res.value.subNodes.map(async (item) => {
            const obj = { value: '' }
            // 判断子节点的类型，需分类处理
            // 1、富文本(ARTICLE): 需调用接口获取富文本内容用来显示
            // 2、电话(TEL): 需要以 ';;' 进行分割显示
            // 3、子节点(CATEGORY): 无需处理
            if(item.type === 'ARTICLE') {
              const r = await _getRichTextById(item.id)
              if(r.value.data) {
                // 对富文本内容进行去标签
                obj.value = filterTag(r.value.data)
              }
              return {...item, ...obj}
            }else if(item.type === 'TEL') {
              const arr = item.title.split(';;')
              const obj = { title: arr[0], value: arr[1] }
              // 结构出除了title之外的剩余属性
              const { title, ...rest }: any = { ...item }
              return { ...rest, ...obj }
            }else {
              return {...item, ...obj}
            }
          }))
        }
      }).finally(() => {
        loading.value = false
      })
    }else {
      queryById(String(route.query.id))
    }
  }

  const queryById = (id: string) => {
    loading.value = true
    _getCategoryById(id).then(async res => {
      if(res.value) {
        showRouteTitle.value = res.value.title
        data.list = await Promise.all(res.value.subNodes.map(async (item) => {
          const obj = { value: '' }
          // 判断子节点的类型，需分类处理
          // 1、富文本(ARTICLE): 需调用接口获取富文本内容用来显示
          // 2、电话(TEL): 需要以 ';;' 进行分割显示
          // 3、富文本(CATEGORY): 无需处理
          if(item.type === 'ARTICLE') {
            const r = await _getRichTextById(item.id)
            if(r.value.data) {
              // 对富文本内容进行去标签
              obj.value = filterTag(r.value.data)
            }
            return {...item, ...obj}
          }else if(item.type === 'TEL'){
            const arr = item.title.split(';;')
            const obj = { title: arr[0], value: arr[1] }
            // 结构出除了title之外的剩余属性
            const { title, ...rest }: any = { ...item }
            return { ...rest, ...obj }
          }else {
            return {...item, ...obj}
          }
        }))
      }
    }).finally(() => {
      loading.value = false
    })
  }

  /**
   * 获取数据时，不需获取对应富文本，适用于 “小图模式”
   */
  const getDataForSmallMode = () => {
    // 如果label存在，则通过getByLabel调用
    // 否则使用getById进行调用
    if(route.query.label) {
      loading.value = true
      _getCategoryByLabel(String(route.query.label)).then(res => {
        if(res.value) {
          showRouteTitle.value = res.value.title
          data.list = res.value.subNodes
        }
      }).finally(() => {
        loading.value = false
      })
    }else {
      queryByIdForSmallMode(String(route.query.id))
    }
  }

  const queryByIdForSmallMode  = (id: string) => {
    loading.value = true
    _getCategoryById(id).then(res => {
      console.log('small_res: ', res)
      if(res.value) {
        showRouteTitle.value = res.value.title
        data.list = res.value.subNodes
      }
    }).finally(() => {
      loading.value = false
    })
  }

  /**
   * 获取数据时，需要一次获取两级的栏目，适用于 “复合模板”
   */
  const getDataForCompositeMode = () => {
    // 1、如果label存在，则通过getByLabel调用，否则使用getById进行调用，获取一级列表
    // 2、再次遍历上面的一级列表，获取各自下面的二级列表
    if(route.query.label) {
      loading.value = true
      _getCategoryByLabel(String(route.query.label)).then(async res => {
        console.log('composed_res: ', res)
        if(res.value) {
          showRouteTitle.value = res.value.title
          data.list = await Promise.all(res.value.subNodes.map(async (item) => {
            const obj = { children: [] }
            // 根据id分别获取每个子栏目的二级目录
            if(item.type === 'CATEGORY') {
              const r = await _getCategoryById(item.id)
              if(r.value) {
                obj.children = r.value.subNodes
              }
              return {...item, ...obj}
            }
            return {...item, ...obj}
          }))
        }
      }).finally(() => {
        loading.value = false
      })
    }else {
      queryByIdForCompositeMode(String(route.query.id))
    }
  }

  const queryByIdForCompositeMode  = (id: string) => {
    loading.value = true
    _getCategoryById(id).then(async res => {
      if(res.value) {
        showRouteTitle.value = res.value.title
        data.list = await Promise.all(res.value.subNodes.map(async (item) => {
          const obj = { children: [] }
          // 根据id分别获取每个子栏目的二级目录
          if(item.type === 'CATEGORY') {
            const r = await _getCategoryById(item.id)
            if(r.value) {
              obj.children = r.value.subNodes
            }
            return {...item, ...obj}
          }
          return {...item, ...obj}
        }))
      }
    }).finally(() => {
      loading.value = false
    })
  }

  const dialogVisible = ref(false)
  const dialogLoading = ref(false)
  const showHtml = ref('')
  const iframeSrc = ref('')
  const dialogTitle = ref('')
  // 区分富文本节点是外链还是纯富文本
  const contentType = ref('')

  const turnTo = (item: any) => {
    dialogLoading.value = true
    // 如果是富文本节点，根据type区分是外部链接（LINK）还是富文本（NATIVE_CONTENT）
    // 外部链接使用iframe，富文本则直接渲染
    if(item.type === 'ARTICLE') {
      _getRichTextById(item.id).then(res => {
        if(res.value) {
          dialogVisible.value = true
          contentType.value = res.value.type
          if(res.value.type === 'LINK') {
            iframeSrc.value = res.value.data
          }else {
            // 对富文本进行字体和字号的优化处理
            showHtml.value = replaceRichText(res.value.data)
            dialogTitle.value = item.title
          } 
        }else {
          createMsg('warning', t('general.noData'), if55 ? 'msg55' : 'msg32')
        }
      }).finally(() => {
        dialogLoading.value = false
      })
    }else if(item.type === 'CATEGORY'){
      if(item.module) {
        // 如果即将跳转的模板类型与当前的相同，则直接重新获取数据即可
        // 考虑到55寸页面的url带有 /55后缀的情况，改为判断startsWith
        if(route.path.startsWith(categoryMap[item.module])) {
          // “小图模式”
          if(route.path.startsWith('/SmallPicMode')) {
            queryByIdForSmallMode(item.id)
          // “复合模式”
          }else if(route.path.startsWith('/ComposedMode')){
            queryByIdForCompositeMode(item.id)
          }else {
          // “无图模式” 与 “大图模式”
            queryById(item.id)
          }
        }else {
          // 如果是子栏目节点，跳转到指定的渲染模板，并传递id
          if(if55) {
            router.push(`${categoryMap[item.module]}/55?label=&id=${item.id}`)
          }else {
            router.push(`${categoryMap[item.module]}?label=&id=${item.id}`)
          }
        }
      }else {
        createMsg('warning', t('general.noData'), if55 ? 'msg55' : 'msg32')
      }
    }
  }

  const filterTag = (html: string): string => {
    if(html) {
      // 去除html标签
      const reg = /<[^>]*>/g
      // 去除空格
      const blankReg = /&nbsp;/g
      // 去除引号
      const quoteReg = /&ldquo;|&rdquo;/g
      return html.replace(reg, '').replace(blankReg, '').replace(quoteReg, '"')
    }
    return ''
  }

  // 使用正则表达式定制化替换富文本中的内容
  const replaceRichText = (html: string): string => {
    if(html) {
      // 1、获取到 “font-size: ” 字符后面的数字
      const fontSizeReg = /(?<=font-size: )\d+/g
      // 匹配到相关数字后，32寸放大1.2倍，55寸放大2.1倍
      const ratio = if55 ? 2.1 : 1.2
      const sizeRes = html.replace(fontSizeReg, function(num) {
        return (Math.round(Number(num) * ratio)).toString()
      })

      // 2、中文模式：替换 “宋体” 为 “华康黑体W5-A”
      //    英文模式：替换 “宋体” 为 “Univers”
      let familyRes = ''
      if(locale.value === 'CN') {
        familyRes = sizeRes.replace(/宋体;/g, '华康黑体W5-A;')
      }else {
        familyRes = sizeRes.replace(/宋体;/g, 'Univers;')
      }

      // 3、去掉所有 a 标签中的href属性
      const hrefReg = /<a (.*?)>/g
      const hrefRes = familyRes.replace(hrefReg, function() {
        return "<a>"
      })

      // 4、针对富文本中图片的resource的问题进行处理：由于凯亚使用的相对其server的相对路径，
      // 故需修改为绝对路径
      const imgReg = /(?<=src=\").+?(?=\" alt)/g
      return hrefRes.replace(imgReg, function(src) {
        console.log('src: ', src)
        // 如果是以http开头，证明是使用的绝对路径的图片，无需处理
        if(src.startsWith('http')) {
          return src
        }else {
          let region = ''
          region = window.location.origin.split('://')[1].startsWith('10') ? 'http://10.235.68.10:5556' : 'https://wap.hzairport.com'
          return region + '/' + src
        }
      })
      // replaceAll方法在Chrome 85+ 才支持，改为上面的降级处理
      // return sizeRes.replaceAll('宋体;', '华康黑体W5-A;')
    }
    return ''
  }

  const prefixImg = (base64: string): string => {
    return 'data:image/jpg;base64,' + base64
  }

  return { loading, showRouteTitle, data, getData, getDataForSmallMode, getDataForCompositeMode, 
    dialogVisible, dialogLoading, dialogTitle, showHtml, iframeSrc, contentType, turnTo, prefixImg }
}