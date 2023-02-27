<template>
  <div id="layer_container">
    <div id="map_container" ref="mapContainer"></div>
    <div class="btns_wrap">
      <!-- 复位地图方向 -->
      <div class="reset_orientation" @click="resetOrientation">
        <img src="../assets/images/compass.png" />
      </div>
      <!-- 楼层切换组件 -->
      <div class="floor_wrap">
        <div
          class="floor_item" 
          v-for="(floor, key) in floorMap"
          :key="key"
          :class="{'selected': selectedFloor.layer === floor.layer}"
          @click="switchFloor(floor.layer, key)">
          {{ floor.label }}
        </div>
      </div>
      <!-- 复位视图中心 -->
      <div class="reset_orientation" style="bottom: 113px;" @click="resetViewCenter">
        <el-icon :size="45" color="#00DDC9">
          <aim />
        </el-icon>
      </div>
    </div>
    <!-- 起点 / 终点 显示框 -->
    <div class="tip_wrap" v-if="showTip">
      <div class="img_wrap">
        <img src="../assets/images/red-green-point.png">
      </div>
      <div class="right_part">
        <p class="origin">{{$t('map.currentPos')}}</p>
        <div class="line"></div>
        <p class="dest">{{dest.name}}</p>
      </div>
      <el-icon :size="50" color="#111" @click="clear">
        <close />
      </el-icon>
    </div>
    <!-- 搜索框 -->
    <div class="input_wrap" v-else>
      <el-input
        v-model="key"
        :placeholder="$t('map.input')"
        @input="inputChange">
      </el-input>
      <div class="list_wrap" v-if="showResult">
        <p class="item" 
          @click="selectItem(place)"
          v-for="place in places" 
          :key="place">
          {{place.name}}
        </p>
        <p class="no_data" v-if="!places.length">{{$t('map.noData')}}</p>
      </div>
    </div>
    <!-- 底部弹窗 -->
    <transition name="raise">
      <div class="bottom_window_wrap" v-show="bottomFlag">
        <p class="dest_name">
          <span style="fontWeight:bold;">{{dest.name}}</span>
          <span style="marginLeft:20px;fontSize:30px;" v-show="distance">{{distance}}M</span>
        </p>
        <div class="virtual_navigate"
          :class="{'disabled': mockNaviFlag}"
          @click="mockNavigate"
          v-if="paths.length">
          {{$t('map.mockNavi')}}
        </div>
        <div class="go" 
          @click="go"
          v-else>
          {{$t('map.go')}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { createMsg } from '../utils/message'
import { ElLoading } from 'element-plus'

import { _getToken, _getTestToken, _planRoute, _queryByPosition, _queryByName, _queryByCode } from '../axios/api/hzController'

import originIcon from '../assets/images/origin.png'
import destinationIcon from '../assets/images/destination.png'
import location from '../assets/images/location.png'

// ol全局样式所在路径
import 'ol/src/ol.css'

// 地图基础元素
import Map from 'ol/Map'
import View from 'ol/View'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import { Vector as SourceVector} from 'ol/source'
import { Vector as LayerVector } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { getLength } from 'ol/sphere'

// 几何地理元素
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { Style, Icon, Stroke, Fill, Text, Circle } from 'ol/style'

const route = useRoute()
// 计算属性：当前页面是否为55寸设备的页面
const if55 =  computed(() => {
  const routesList = route.path.split('/')
  return routesList.indexOf('55') != -1
})

const { t } = useI18n()

const store = useStore()
let map: any = null

const props = defineProps({
  poiId: {    // 传入的点位poiId：美食 / 购物 列表中的商铺通过poiId进行传递
    type: String,
    required: false
  },
  name: {   // 传入点位的名称：航班列表中的登机口 / 值机柜台会通过name进行传递
    type: String,
    required: false
  },
  exit: {   // 机场出口：直接使用机场出口点位对应的坐标作为终点坐标，绘制出规划路径
    type: Boolean,
    required: false
  }
})

// 起点坐标
const origin = {
  // 起点坐标：默认为航显设备的坐标，从store中获取
  pos: store.state.innateProperties.x ? [store.state.innateProperties.x, store.state.innateProperties.y] : [120.42628740115443, 30.23628709753917],
  name: t('map.currentPos'),
  floor: store.state.innateProperties.floor || 'F4'
}

// 终点坐标
const dest: any = reactive({
  pos: [],
  name: '',
  floor: ''
})

// 规划路径的距离，预估时间 = 路径 / 1.5m/s
const distance = ref(0)

/**
 * 楼层相关逻辑
 */
// 杭州机场真实图层Map
const floorMap = {
  'F5': {
    label: '5F',
    layer: 'hgh:t4_shinei_f5'
  },
  'F4': {
    label: '4F',
    layer: 'hgh:t4_shinei_f4'
  },
  'F3': {
    label: '3F',
    layer: 'hgh:t4_shinei_f3'
  },
  'F2': {
    label: '2F',
    layer: 'hgh:t4_shinei_f2'
  },
  'F1': {
    label: '1F',
    layer: 'hgh:t4_shinei_f1'
  },
  'B1': {
    label: 'B1',
    layer: 'hgh:t4_shinei_b1'
  },
  'B2': {
    label: 'B2',
    layer: 'hgh:t4_shinei_b2'
  }
}

const selectedFloor = reactive({
  name: '',
  layer: ''
})

const switchFloor = (layer: string, name: string) => {
  if(!pathLayer) {
    selectedFloor.name = name
    selectedFloor.layer = layer
    // 切换楼层之前先将地图上的相关元素全部清空
    clear()
    // 图层切换
    source.updateParams({ layers: layer })
    // 判断切换的楼层是否为当前设备所在楼层，如果不是则将起始点位隐藏
    if(name === origin.floor) {
      if(!originPointLayer) {
        addPoint(origin.pos, map, origin.name)
      }
    }else {
      // 删掉起始点位
      if(originPointLayer) {
        originPointLayer.getSource().clear()
        map.removeLayer(originPointLayer)
        originPointLayer = null
      }
    }
  }
}

/**
 * 搜索框相关逻辑
 */
const showResult = ref(false)  // 是否显示搜索结果列表
const places: any = ref([])
const key = ref('')
let timer: any = null
const inputChange = (e) => {
  if(timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    // 调用接口传入key.value，模糊查询相关店铺列表
    _queryByName(key.value).then(res => {
      places.value = res.data
      showResult.value = true
    })
  }, 600)
}

const selectItem = (item: any) => {
  if(!pathLayer) {
    switchFloor(floorMap[item.floor.toUpperCase()].layer, item.floor.toUpperCase())
    view.setCenter([item.lon, item.lat])
    addPoint([item.lon, item.lat], map, item.name)
    // 绘制高亮
    drawHighLight(item.geom)
    dest.name = item.name
    dest.pos = [item.lon, item.lat]
    dest.floor = item.floor
    showResult.value = false
    if(!bottomFlag.value) bottomFlag.value = true
  }
}

/**
 * 【起点 / 终点】顶部提示框相关逻辑
 */
const showTip = ref(false)

/**
 * 底部提示框
 */
const bottomFlag = ref(false)

// 获取mapContainer对应的DOM元素
let mapContainer =  ref<HTMLElement | null>(null)

// 将view设置为全局变量，方便设置视图中心
let view: any = null

// 将source变量设置在全局作用域，方便后面切换楼层图层
let source: any = null

onMounted(async () => {
  // 全局添加点击事件，隐藏搜索列表
  window.addEventListener('click', () => {
    showResult.value = false
  })
  // 在初始化时，先将map容器内容置空，以防production版本中出现两个canvas的问题
  if(mapContainer.value)
    mapContainer.value.innerHTML = ''

  if(store.state.innateProperties.floor) {
    selectedFloor.name = store.state.innateProperties.floor
    selectedFloor.layer = floorMap[selectedFloor.name].layer
  }else {
    selectedFloor.name = 'F4'
    selectedFloor.layer = floorMap['F4'].layer
  }

  // 设置区域的左上角、右下角点的坐标作为extent坐标
  // TODO - 待DMZ重新联通后，需重新按照实际地图尺寸，将可视范围扩大
  const maxExtent = boundingExtent([
    [120.41878184560372, 30.242242088393308], [120.43205886165826, 30.23119975843494]
  ])

  view = new View({
    extent: transformExtent(maxExtent, 'EPSG:4326', 'EPSG:4326'),
    projection: 'EPSG:4326',
    center: origin.pos,
    rotation: store.state.innateProperties.rotation ? store.state.innateProperties.rotation : 0,
    zoom: 19 // 适用于真实环境
  })

  // 获取渲染地图所需的token
  const tokenRes = await _getToken()
  console.log('dmz token res: ', tokenRes)

  let mapUrl = ''
  if(window.location.hostname.startsWith('10.235')) {
    mapUrl = `http://${config.hz.mapHost}/gateway/UniServer/hgh/wms?service=WMS&token=${tokenRes.data}`
  }else {
    mapUrl = `https://wap.hzairport.com/gateway/UniServer/hgh/wms?service=WMS&token=${tokenRes.data}`
  }
  source = new TileWMS({
    // 先用DMZ区域的进行测试
    url: mapUrl,
    params: {
      layers: selectedFloor.layer
    }
  })
  const layers = [
    new TileLayer({
      // WMS（Web Map Service）图层
      source
    })
  ]
  map = new Map({
    target: 'map_container',
    view,
    layers
  })

  /**
   * 地图相关操作
   */
  // 1、绑定点击事件 -> 根据点击地图中点的坐标，调用接口获取对应的点位信息
  map.on('singleclick', async (e) => {
    const res = await _queryByPosition(selectedFloor.name.toLowerCase(), e.coordinate[0], e.coordinate[1])
    console.log('Point res: ', res)
    if(res.data.length) {
      if(!bottomFlag.value) bottomFlag.value = true
      const data = res.data[0]
      if(!pathLayer) {
        // view.setCenter(e.coordinate)
        dest.name = data.name
        dest.pos = [data.lon, data.lat]
        dest.floor = data.floor
        addPoint([data.lon, data.lat], map, data.name)
        // 绘制高亮
        drawHighLight(data.geom)
      }
    }else {
      // 暂时不显示无地理坐标的提示
      // createMsg('warning', t('map.noShop'), if55.value ? 'msg55' : 'msg32')
    }
  })

  // 2、绘制起点【获取当前设备所在位置坐标】
  addPoint(origin.pos, map, origin.name)

  // 3、判断props.name是否存在【登机口 / 值机柜台】，若存在，调用_queryByName查询
  if(props.name) {
    const loading = ElLoading.service({
      lock: true,
      text: t('general.calculate'),
      background: 'rgba(10, 10, 10, .5)',
      customClass: 'call_robot_32'
    })
    _queryByName(props.name).then(async res => {
      console.log('query by props name res: ', res.data)
      if(res.data && res.data.length) {
        // 过滤出所有登机口点位的list，对应的type值为1107
        const gateList = res.data.filter(item => item.type == '1107')
        const posInfo = gateList[0]
        dest.name = posInfo.name
        dest.pos = [posInfo.lon, posInfo.lat]
        dest.floor = posInfo.floor
        await planPath(dest.pos, map, dest.floor)
        if(paths.value.length === 1)
          addPoint([posInfo.lon, posInfo.lat], map, posInfo.name)
        if(paths.value[0])
          drawPath(paths.value[0].edgeList)
        bottomFlag.value = true
      }else {
        createMsg('warning', t('map.noPath'), if55.value ? 'msg55' : 'msg32')
      }
    }).finally(() => {
      loading.close()
    })
  }

  // 4、判断是否为机场出口，如果为机场出口，直接将终点坐标置为机场出口，绘制对应规划路径
  if(props.exit) {
    // 机场出口对应坐标：[120.42512925263068, 30.23737023410219], 楼层为f2
    dest.name = t('subPage.airportExit.title')
    dest.pos = [120.42512925263068, 30.23737023410219]
    dest.floor = 'f2'
    await planPath(dest.pos, map, dest.floor)
    if(paths.value.length === 1)
      addPoint(dest.pos, map, dest.name)
    drawPath(paths.value[0].edgeList)
    bottomFlag.value = true
  }
})

watch(() => props.poiId, (val, oldVal) => {
  if(val) {
    console.log('select shop, poiId: ', val)
    _queryByCode(val).then(res => {
      console.log('get by poiId res: ', res)
      if(res.data) {
        const posInfo = res.data
        selectItem(posInfo)
      }else {
        createMsg('warning', t('map.noShop'), if55.value ? 'msg55' : 'msg32')
      }
    })
  }else {
    // poiId为空
    createMsg('warning', t('map.noPoiId'), if55.value ? 'msg55' : 'msg32')
  }
})

/**
 * 规划路径的集合，因为有跨楼层的情况，所以定义为一个数组，且最多有两个项元素
 * 数组中的每一项的结构：
 * { floor: 'f4', edgeList": [GeoJSON], points: [[x1, y1, theta1], [x2, y2, theta2]] }
 * points 属性在模拟导航的时候使用
 */
type path = {
  floor: string,
  edgeList: object[],
  points: number[][]
}
const paths = ref<path[]>([])

/**
 * 调用接口，计算规划路径，并攒出需要的数据结构
 * @param points 终点坐标
 * @param map 地图对象实例
 * @param destFloor 终点所处楼层
 */
const planPath = async (points: number[], map: Map, destFloor: string) => {
  // 1、根据传入的终点坐标，调用接口获取整条规划路径
  const obj = {
    p1: { floor: origin.floor.toLowerCase(), lon: origin.pos[0], lat: origin.pos[1] },
    p2: { floor: destFloor, lon: points[0], lat: points[1] }
  }
  const res = await _planRoute(obj)
  console.log('plan res: ', res)
  if(res.data && res.data.floorPaths && res.data.floorPaths.length && res.data.floorPaths[0].edges.length) {
    showTip.value = true
    // 2、遍历floorPaths数组，构建paths
    res.data.floorPaths.forEach(e => {
      const obj1: path = {
        floor: e.floor,
        edgeList: [],
        points: []
      }
      e.edges.forEach((edge, index) => {
        const newEdge = JSON.parse(edge.edge)
        obj1.edgeList.push(newEdge)
        const coor = newEdge.geometry.coordinates
        /**
         * 计算每段线段的斜率对应的 θ 角
         * 如果Δx > 0, 旋转角度为 ∏/2 - θ
         * 如果Δx < 0, 旋转角度为 ∏/2 - θ + ∏，即3∏/2 - θ
         */
        let theta = Math.atan((coor[0][1][1] - coor[0][0][1]) / (coor[0][1][0] - coor[0][0][0]))
        // 取每一段路径中线段起点的坐标，添加到points数组中
        if(coor[0][1][0] - coor[0][0][0] > 0) {
          theta = Math.PI / 2 - theta
        }else {
          theta = Math.PI * 3 / 2 - theta
        }
        obj1.points.push([...coor[0][0], theta])
        // 最后一个点需要把终点也添加进去
        if(index === e.edges.length - 1) {
          obj1.points.push([...coor[0][1], theta])
        }
      })
      paths.value.push(obj1)
    })
    // 3、获取规划路径的距离
    distance.value = res.data.length ? res.data.length.toFixed(2) : 0
  }else {
    createMsg('warning', t('map.noPath'), if55.value ? 'msg55' : 'msg32')
  }
}

/**
 * 轨迹绘制函数
 * @param geoJsonList 每一层规划路径的GeoJSON数据集合
 */
let pathLayer: any = null
const drawPath = (geoJsonList: object[]) => {
  let featuresGeoJSON = {
    type: 'FeatureCollection',
    features: geoJsonList
  }
  let sourceVector = new SourceVector({
    features: new GeoJSON().readFeatures(featuresGeoJSON)
  })
  const lineStyle = new Style({
    // 线的样式
    stroke: new Stroke({
      color: '#00DDC9',
      width: 15,
      // lineDash: [20]
    })
  })
  if(pathLayer) {
    pathLayer.getSource().clear()
    map.removeLayer(pathLayer)
    pathLayer = null
  }
  // 创建矢量图层
  pathLayer = new LayerVector({
    source: sourceVector,
    style: lineStyle,
    zIndex: 1
  })
  // 获取规划路径的extent，并以该路径作为视图中心进行显示
  const pathExtent = pathLayer.getSource().getExtent()
  view.fit(pathExtent, {
    size: map.getSize(),
    padding: [400, 150, 250, 200],  // 设置视区范围padding
    duration: 500
  })
  map.addLayer(pathLayer)
}

/**
 * 打点函数
 * @param lnglat [经度, 纬度]
 * @param map 地图对象实例
 */
let originPointLayer: any = null
let destPointLayer: any = null
const addPoint = (lnglat: number[], map: Map, name?: string) => {
  // 当存在规划路径图层时，不允许选点
  if(!pathLayer) {
    // 创建矢量资源容器
    let sourceVector = new SourceVector({})
    // 获取坐标特征
    const feature = createPointFeature(lnglat)
    sourceVector.addFeature(feature)

    // 创建打点样式
    const iconStyle = new Style({
      image: new Icon({
        scale: 0.8, // 控制icon图片的缩放比例
        opacity: 0.95,
        src: name === origin.name ? originIcon : destinationIcon,
        // 设置图片的偏移，以icon的底边中心作为点位坐标
        anchor: [40, 81],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
      }),
      // 写文字
      text: new Text({
        textAlign: 'center',
        text: name,
        offsetY: -90,
        font: 'bold 40px Univers',
        fill: new Fill({
          color: '#404044'
        })
      })
    })
    // 如果是起点，直接添加，若不是
    if(name === t('map.currentPos')) {
      originPointLayer = new LayerVector({
        source: sourceVector,
        style: iconStyle,
        zIndex: 2
      })
      map.addLayer(originPointLayer)
    }else {
      // 如若存在，则先删除
      if(destPointLayer) {
        destPointLayer.getSource().clear()  // 删除点的信息
        map.removeLayer(destPointLayer)     // 将点对应的图层从map容器中移除
        destPointLayer = null               // 将对应图层置空
      }
      destPointLayer = new LayerVector({
        source: sourceVector,
        style: iconStyle,
        zIndex: 2
      })
      map.addLayer(destPointLayer)
    }
  }
}

let highLightLayer: any = null
const drawHighLight = (geoJson: any) => {
  if(!pathLayer) {
    let sourceVector = new SourceVector({
      features: new GeoJSON().readFeatures(geoJson)
    })
    const lineStyle = new Style({
      // 线的样式
      stroke: new Stroke({
        color: 'orange',
        width: 2,
      }),
      // 填充颜色
      fill: new Fill({
        color: 'pink'
      })
    })
    if(highLightLayer) {
      highLightLayer.getSource().clear()  // 删除高亮区资源
      map.removeLayer(highLightLayer)     // 将高亮区图层从map容器中移除
      highLightLayer = null               // 将对应高亮区图层置空
    }
    // 创建矢量图层
    highLightLayer = new LayerVector({
      source: sourceVector,
      style: lineStyle
    })
    map.addLayer(highLightLayer)
  }
}

const createPointFeature = (lnglat: number[]) => {
  return new Feature({
    geometry: new Point(lnglat, 'XY')
  })
}

const createLineFeature = (lnglats: number[][]) => {
  return new Feature({
    geometry: new LineString(lnglats, 'XY')
  })
}

/**
 * 去这里
 */
const go = async () => {
  if(!pathLayer) {
    await planPath(dest.pos, map, dest.floor)
    if(paths.value.length) {
      // 若起点、终点在同一层，则直接绘制规划路径即可
      if(paths.value.length === 1) {
        drawPath(paths.value[0].edgeList)
      }else {
        // 如果paths数组长度大于1，则代表是跨楼层导航，需先切换至起点的楼层，并绘制第一段路径
        selectedFloor.name = origin.floor
        selectedFloor.layer = floorMap[origin.floor].layer
        source.updateParams({layers: selectedFloor.layer})
        addPoint(origin.pos, map, origin.name)
        // 去除终点高亮区域
        if(highLightLayer) {
          highLightLayer.getSource().clear()  // 删除高亮区资源
          map.removeLayer(highLightLayer)     // 将高亮区图层从map容器中移除
          highLightLayer = null               // 将对应高亮区图层置空
        }
        // 删除掉终点的marker图层
        if(destPointLayer) {
          destPointLayer.getSource().clear()  // 删除点的信息
          map.removeLayer(destPointLayer)     // 将点对应的图层从map容器中移除
          destPointLayer = null
        }
        // 画第一段路径
        drawPath(paths.value[0].edgeList)
      }
    }else {
      createMsg('warning', t('map.noPath'), if55.value ? 'msg55' : 'msg32')
    }
  }
}

// 标识已点击过模拟导航
let mockNaviFlag = ref(false)
// 模拟导航点位
let naviPointLayer: any = null
/**
 * 模拟导航
 */
const mockNavigate = () => {
  // 标识航显处于 "繁忙" 状态，不适于超过10S自动返回首页的逻辑
  store.commit('SET_BUSY', true)
  console.log('path value: ', paths.value.length)
  mockNaviFlag.value = true
  // TODO - mockNavi
  // 1、在每一段规划路径的每两个点中间添加分割点位
  paths.value.forEach((item: path) => {
    let res: number[][] = []
    for(let i=1; i<item.points.length; i++) {
      res.push(...insertPoints(item.points[i-1], item.points[i]))
    }
    item.points = res
  })
  console.log('paths: ', paths.value)

  // 2、创建移动在规划路径上的点
  let sourceVector = new SourceVector({})
  const feature = createPointFeature([paths.value[0].points[0][0], paths.value[0].points[0][1]])
  sourceVector.addFeature(feature)
  const image = new Icon({
    scale: 1.5, // 控制icon图片的缩放比例
    src: location,
    // 设置图片的偏移，以location图片中心作为点位坐标
    anchor: [35, 35],
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    rotation: 0
  })
  const iconStyle = new Style({
    image
  })
  naviPointLayer = new LayerVector({
    source: sourceVector,
    style: iconStyle,
    zIndex: 2
  })
  map.addLayer(naviPointLayer)

  // 3、遍历轨迹的数组，动态改变点的坐标
  let i = 1;
  let interval = setInterval(() => {
    if(paths.value.length) {
      if(i === paths.value[0].points.length) {
        clearInterval(interval)
        store.commit('SET_BUSY', false)
        if(paths.value.length === 2) {
          store.commit('SET_BUSY', true)
          // 如果paths存在两项数组，则为跨楼层规划路径
          selectedFloor.name = dest.floor.toUpperCase()
          selectedFloor.layer = floorMap[dest.floor.toUpperCase()].layer
          // 切换到终点所在楼层的图层
          source.updateParams({layers: selectedFloor.layer})
          // 先删除掉起点的marker图层
          originPointLayer.getSource().clear()  // 删除点的信息
          map.removeLayer(originPointLayer)     // 将点对应的图层从map容器中移除
          originPointLayer = null
          // 绘制终点前，先将第一段路径的图层清空删除
          if(pathLayer) {
            pathLayer.getSource().clear()
            map.removeLayer(pathLayer)
            pathLayer = null
          }
          // 绘制终点的marker图层
          addPoint(dest.pos, map, dest.name)
          // 画第二段路径
          drawPath(paths.value[1].edgeList)
          // 动态变化第二段路径的坐标
          i = 1
          interval = setInterval(() => {
            if(i === paths.value[1].points.length) {
              clearInterval(interval)
              store.commit('SET_BUSY', false)
            }else {
              image.setRotation(paths.value[1].points[i][2])
              const point = paths.value[1].points[i]
              const geom = new Point([point[0], point[1]], 'XY')
              feature.setGeometry(geom)
              i++
            }
          }, 50)
        }
      }else {
        image.setRotation(paths.value[0].points[i][2])
        const point = paths.value[0].points[i]
        const geom = new Point([point[0], point[1]], 'XY')
        feature.setGeometry(geom)
        i++
      }
    }else {
      clearInterval(interval)
    }
  }, 50)
}

const insertPoints = (p1: number[], p2: number[]): number[][] => {
  const resArr = [p1, p2]
  const distance = Math.floor(Math.pow(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2), 0.5) * 100000)
  // console.log('distance: ', distance)
  if(distance > 0) {
    const unitX = (1 / distance) * (p2[0] - p1[0])
    const unitY = (1 / distance) * (p2[1] - p1[1])
    // 插入点的个数为距离减一，如两点间距离是19，即插入18个点
    for(let i=1; i<distance; i++) {
      const point = [p1[0] + (i * unitX), p1[1] + (i * unitY), p1[2]]
      resArr.splice(i, 0, point)
    }
  }
  return resArr
}

/**
 * 返回、清空
 */
const clear = () => {
  store.commit('SET_BUSY', false)
  showResult.value = false
  showTip.value = false
  bottomFlag.value = false
  mockNaviFlag.value = false
  // 清空pathLayer
  if(pathLayer) {
    pathLayer.getSource().clear()  // 删除点的信息
    map.removeLayer(pathLayer)     // 将点对应的图层从map容器中移除
    pathLayer = null  
  }
  // 若起点不存在，则画出起点，并回到起始楼层
  // if(!originPointLayer) {
    // selectedFloor.name = origin.floor
    // selectedFloor.layer = floorMap[origin.floor]
    // source.updateParams({layers: floorMap[origin.floor]})
    // addPoint(origin.pos, map, origin.name)
  // }
  // 清空终点destPointLayer
  if(destPointLayer) {
    destPointLayer.getSource().clear()  // 删除点的信息
    map.removeLayer(destPointLayer)     // 将点对应的图层从map容器中移除
    destPointLayer = null               // 将对应图层置空
  }
  // 清空highLightLayer
  if(highLightLayer) {
    highLightLayer.getSource().clear()
    map.removeLayer(highLightLayer)
    highLightLayer = null
  }
  // 清空naviPointLayer
  if(naviPointLayer) {
    naviPointLayer.getSource().clear()
    map.removeLayer(naviPointLayer)
    naviPointLayer = null
  }
  // 清空距离
  distance.value = 0
  // 清空终点
  dest.name = ''
  dest.pos = []
  dest.floor = ''
  // 清空搜索框
  key.value = ''
  // 清空paths
  paths.value = []
  // 视图回到以起点为视图中心
  view.setCenter(origin.pos)
  // 视图回归到最初的zoom
  view.setZoom(19)
}

// 复位地图旋转方向
const resetOrientation = () => {
  view.setRotation(0)
}

// 复位地图视图中心与楼层，即回到 “我的位置”
const resetViewCenter = () => {
  view.setCenter(origin.pos)
  switchFloor(floorMap[origin.floor].layer, origin.floor)
}
</script>

<style lang="scss" scoped>
#layer_container{
  height: 100%;
  position: relative;
  #map_container{
    height: 100%;
  }
  .btns_wrap{
    position: absolute;
    left: 20px;
    bottom: 175px;
    .reset_orientation{
      width: 76px;    
      height: 76px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .floor_wrap{
      z-index: 99;
      background-color: #fff;
      border-radius: 40px;
      box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
      padding: 10px;
      padding-bottom: 16px;
      margin: 13px 0;
      .floor_item{
        width: 60px;
        height: 60px;
        border-radius: 30px;
        line-height: 60px;
        font-size: 30px;
        font-family: 'Univers';
        margin-top: 8px;
        background-color: #eee;
        color: #00DDC9;
      }
      .selected{
        background-color: #00DDC9;
        color: #fff;
      }
    }
  }
  :deep(.input_wrap){
    // width: 100%; 
    position: absolute;
    padding-left: 118px;
    top: 20px;
    .el-input{
      width: 700px;
      .el-input__inner{
        height: 86px;
        line-height: 86px;
        font-size: 32px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0px 10px 18px 2px rgba(0,0,0,0.2200);
      }
    }
    .list_wrap{
      height: 600px;
      border-radius: 10px;
      background-color: #fff;
      border: 1px solid #aaa;
      margin-top: 5px;
      padding: 20px;
      overflow-y: scroll;
      .item{
        line-height: 70px;
        font-size: 30px;
        border-bottom: 1px solid #ccc;
      }
      .no_data{
        line-height: 558px;
        font-size: 30px;
      }
    }
  }
  .tip_wrap{
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #aaa;
    display: flex;
    align-items: center;
    padding: 25px 35px;
    .right_part{
      width: calc(100% - 110px);
      margin: 0 30px;
      .origin, .dest{
        font-size: 30px;
        text-align: left;
        padding-left: 20px;
      }
      .line{
        border-top: 1px solid #aaa;
        margin: 20px 0;
      }
    }
  }
  .bottom_window_wrap{
    width: 92%;
    height: 120px;
    position: absolute;
    left: 4%;
    bottom: 30px;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.09);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .dest_name{
      font-size: 35px;
    }
    .go{
      width: 140px;
      height: 140px;
      line-height: 140px;
      border-radius: 70px;
      background-color: #06CED1;
      font-size: 36px;
      color: #fff;
      margin-bottom: 90px;
    }
    .virtual_navigate{
      padding: 16px 36px;
      font-size: 34px;
      background-color: #084aa6;
      color: #fff;
      border-radius: 33px;
    }
    .disabled{
      pointer-events: none;
      cursor: default;
      opacity: .4;
    }
  }
}
</style>