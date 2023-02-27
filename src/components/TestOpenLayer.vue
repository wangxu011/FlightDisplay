<template>
  <div id="layer_container">
    <div id="map_container" ref="mapContainer"></div>
    <!-- 复位地图方向 -->
    <div class="reset_orientation" @click="resetOrientation">
      <el-icon :size="45" color="#00DDC9">
        <position />
      </el-icon>
    </div>
    <!-- 复位视图中心 -->
    <div class="reset_orientation" style="bottom: 113px;" @click="resetViewCenter">
      <el-icon :size="45" color="#00DDC9">
        <aim />
      </el-icon>
    </div>
    <!-- 楼层切换组件 -->
    <div class="floor_wrap">
      <div 
        class="floor_item" 
        v-for="(floor, key) in floorMap"
        :key="key"
        :class="{'selected':selectedFloor.layer === floor}"
        @click="switchFloor(floor, key)">
        {{key}}
      </div>
    </div>
    <!-- 起点 / 终点 显示框 -->
    <div class="tip_wrap" v-if="showTip">
      <el-icon :size="65" color="#111" @click="clear">
        <back />
      </el-icon>
      <div class="img_wrap">
        <img src="../assets/images/red-green-point.png">
      </div>
      <div class="right_part">
        <p class="origin">当前位置</p>
        <div class="line"></div>
        <p class="dest">{{dest.name}}</p>
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="input_wrap" v-else>
      <el-input
        v-model="key"
        placeholder="请输入位置名称"
        @input="inputChange">
      </el-input>
      <div class="list_wrap" v-if="showResult">
        <p class="item" 
          @click="selectItem(place)"
          v-for="place in places" 
          :key="place">
          {{place.name}}
        </p>
        <p class="no_data" v-if="!places.length">没有搜索到匹配项</p>
      </div>
    </div>
    <!-- 底部弹窗 -->
    <transition name="raise">
      <div class="bottom_window_wrap" v-show="bottomFlag">
        <p class="dest_name">
          <span style="fontWeight:bold;">{{dest.name}}</span>
          <span style="marginLeft:20px;fontSize:30px;">{{distance}}M</span>
        </p>
        <div class="go" @click="go">去这里</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { createMsg } from '../utils/message'

import { _getTestToken, _planRoute, _queryByPosition, _queryByName } from '../axios/api/hzController'

// import location from '../assets/images/location.png'
import originIcon from '../assets/images/origin.png'
import destinationIcon from '../assets/images/destination.png'

// ol全局样式所在路径
import 'ol/src/ol.css'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'

// 地图基础元素
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultControls } from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import { Vector as SourceVector} from 'ol/source'
import { Vector as LayerVector } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'

// 几何地理元素
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { Style, Icon, Stroke, Fill, Text, Circle } from 'ol/style'

const store = useStore()
let map: any = null

const props = defineProps({
  pos: {    // 传入的点位poi（point of interest）坐标 【终点】
    type: Array as () => Array<number>,
    required: false
  },
  name: {   // 传入点位的名称
    type: String,
    required: false
  },
  floor: {  // 传入点位所在楼层
    type: String,
    required: false
  }
})

// 起点坐标：默认为航显设备的坐标，从store中获取
// const origin: number[] = [store.state.innateProperties.x, store.state.innateProperties.y]
// test data
const origin = {
  pos: [-122.44640350341798, 37.7419963987918],
  name: '当前位置',
  floor: store.state.innateProperties.floor || 'f4'
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
  'f5': 'hgh:t4_shinei_f5',
  'f4': 'hgh:t4_shinei_f4',
  'f3': 'hgh:t4_shinei_f3',
  'f2': 'hgh:t4_shinei_f2',
  'f1': 'hgh:t4_shinei_f1',
  'b1': 'hgh:t4_shinei_b1',
  'b2': 'hgh:t4_shinei_b2',
}

const selectedFloor = reactive({
  name: '',
  layer: ''
})

const switchFloor = (layer: string, name: string) => {
  selectedFloor.name = name
  selectedFloor.layer = layer
  console.log('selected floor: ', selectedFloor)
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
    console.log('value: ', key.value)
    // mock - code
    setTimeout(() => {
      places.value = [
        { name: 'B20', coordinate: [-122.44179010391238, 37.715373991260066]}
      ]
      showResult.value = true
    }, 500)
  }, 600)
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

// 存储当前规划的路径对应的feature
// let pathFeature: any = null
let pathExtent: any = null

onMounted(async () => {
  // 在初始化时，先将map容器内容置空，以防production版本中出现两个canvas的问题
  if(mapContainer.value)
    mapContainer.value.innerHTML = ''

  selectedFloor.name = store.state.innateProperties.floor ? store.state.innateProperties.floor : 'f4'
  selectedFloor.layer = store.state.innateProperties.floor ? floorMap[store.state.innateProperties.floor] : floorMap['f4']
  
  const center = [-122.44640350341798, 37.7318963987918]

  // 设置区域的左上角、右下角点的坐标作为extent坐标
  const maxExtent = boundingExtent([[-122.52911460521905, 37.82431517391254], [-122.35929098005793, 37.62146743752777]])

  view = new View({
    extent: transformExtent(maxExtent, 'EPSG:4326', 'EPSG:4326'),
    projection: 'EPSG:4326',
    center,
    zoom: 15
  })

  // 获取渲染地图所需的token
  const tokenRes = await _getTestToken()
  source = new TileWMS({
    url: `http://106.38.108.70:18994/gateway/UniServer/hgh/wms?service=WMS&token=${tokenRes.data}`,
    // url: 'http://www.airesip.org/wms/process.cgi?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS', // 随便找的url
    params: {
      // 公网测试图层
      layers: 'hgh:street'
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
    layers,
    // controls: defaultControls({
    //   zoom: true,
    //   rotate: true
    // })
  })

  /**
   * 地图相关操作
   */
  // 1、绑定点击事件 -> 根据点击地图中点的坐标，调用接口获取对应的点位信息
  map.on('singleclick', async (e) => {
    if(!bottomFlag.value) bottomFlag.value = true
    console.log(e.coordinate)
    if(!pathLayer) {
      addPoint(e.coordinate, map, '测试点位')
      // view.setCenter(e.coordinate)
      dest.name = '测试点位'
      dest.pos = e.coordinate
      // 绘制高亮对应的GeoJson
      const gj = `{"geometry":{"coordinates":[[[${e.coordinate}],[-122.4451804161072,37.72672509981109],[-122.43689775466922,37.731617449054255],[-122.4457383155823,37.73771142793609]]],"type":"Polygon"},"type":"Feature","properties":{"instruction":"P2","length":55.0,"action":"q"}}`
      drawHighLight(gj)
    }
    // 2、绘制起点【获取当前设备所在位置坐标】
    addPoint(origin.pos, map, '当前位置')

    // 3、若有props传入的点位，则将其设置为终点，并绘制从航显所在点位【起】到传入点位【终】的规划路径
    if(props.pos && props.name) {
      addPoint(props.pos, map, props.name)
      dest.name = props.name
      dest.pos = props.pos
      // TODO: 根据起点和终点的坐标，调用接口获取两点间规划的路径，并进行绘制
      drawPlanPath(props.pos, map, props.floor || '')
    }
  })

  // 2、绘制起点【获取当前设备所在位置坐标】
  addPoint(origin.pos, map, '当前位置')

  // 3、若有props传入的点位，则将其设置为终点，并绘制从航显所在点位【起】到传入点位【终】的规划路径
  if(props.pos && props.name) {
    addPoint(props.pos, map, props.name)
    dest.name = props.name
    dest.pos = props.pos
    // TODO: 根据起点和终点的坐标，调用接口获取两点间规划的路径，并进行绘制
    drawPlanPath(props.pos, map, props.floor || '')
  }
})

/**
 * 轨迹绘制函数
 * @param points 终点坐标
 * @param map 地图对象实例
 * @param destFloor 终点所处楼层
 */
let pathLayer: any = null
const drawPlanPath = async (points: number[], map: Map, destFloor: string) => {
  // mock-data
  const edges = [
    {
      edge: `{"geometry":{"coordinates":[[[-122.44640350341798, 37.7419963987918], [${points}]]],"type":"MultiLineString"},"type":"Feature","properties":{}}`,
      length: 55
    }
  ]
  // const edges = [
  //   `{"geometry":{"coordinates":[[[-122.44640350341798, 37.7419963987918], [-122.45594024556343, 37.73110961573454]]],"type":"MultiLineString"},"type":"Feature","properties":{}}`,
  //   `{"geometry":{"coordinates":[[[-122.45594024556343, 37.73110961573454], [-122.44230270182018, 37.72166824000212]]],"type":"MultiLineString"},"type":"Feature","properties":{}}`
  // ]
  const edgeList: any[] = []
  edges.forEach(edge => {
    edgeList.push(JSON.parse(edge.edge))
    distance.value += edge.length
  })
  let featuresGeoJSON = {
    type: 'FeatureCollection',
    features: edgeList
  }
  // const routeRes = `{"geometry":{"coordinates":[[[${origin.pos}], [${points}]]],"type":"MultiLineString"},"type":"Feature","properties":{}}`
  let sourceVector = new SourceVector({})
  sourceVector.addFeatures(createGeoJsonFeature(featuresGeoJSON, 'path'))
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
  pathExtent = pathLayer.getSource().getExtent()
  map.addLayer(pathLayer)
}

/**
 * 打点函数
 * @param lnglat [经度, 纬度]
 * @param map 地图对象实例
 */
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
        scale: 1, // 控制icon图片的缩放比例
        opacity: 0.95,
        src: name === '当前位置' ? originIcon : destinationIcon,
        // 设置图片的偏移，以icon的底边中心作为点位坐标
        anchor: [30, 70],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
      }),
      // 写文字
      text: new Text({
        textAlign: 'center',
        text: name || '您的位置',
        offsetY: -90,
        font: 'normal 40px 黑体',
        fill: new Fill({
          color: 'orange'
        })
      })
    })
    // 如果是起点，直接添加，若不是
    if(name === '当前位置') {
      const originLayer = new LayerVector({
        source: sourceVector,
        style: iconStyle,
        zIndex: 2
      })
      map.addLayer(originLayer)
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
    let sourceVector = new SourceVector({})
    sourceVector.addFeature(createGeoJsonFeature(geoJson, 'highLight'))
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

const createGeoJsonFeature = (geoJson: any, type: string): any => {
  if(type === 'path') {
    // 如果是路径，则将对应的feature保存到全局变量中
    return new GeoJSON().readFeatures(geoJson)
  }
  return new GeoJSON().readFeature(geoJson)
}

const selectItem = (item: any) => {
  if(!pathLayer) {
    view.setCenter([item.lon, item.lat])
    addPoint([item.lon, item.lat], map, item.name)
    // 绘制高亮
    drawHighLight(item.geom)
    dest.name = item.name
    dest.pos = [item.lon, item.lat]
    showResult.value = false
    if(!bottomFlag.value) bottomFlag.value = true
  }
}

/**
 * 去这里
 */
const go = () => {
  if(!pathLayer) {
    const feature = drawPlanPath(dest.pos, map, dest.floor)
    showTip.value = true
    // 根据路径，将其作为视区中心
    view.fit(pathExtent, {
      size: map.getSize(),
      padding: [400, 150, 250, 200],  // 设置视区范围padding
      duration: 500
    })
  }
}

/**
 * 返回、清空
 */
const clear = () => {
  showResult.value = false
  showTip.value = false
  bottomFlag.value = false
  // 清空pathLayer
  if(pathLayer) {
    pathLayer.getSource().clear()  // 删除点的信息
    map.removeLayer(pathLayer)     // 将点对应的图层从map容器中移除
    pathLayer = null
  }
  // 清空pointLayer
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
  // 清空终点
  dest.name = ''
  dest.pos = []
  // 清空搜索框
  key.value = ''
  view.setCenter(origin.pos)
}

// 复位地图旋转方向
const resetOrientation = () => {
  view.setRotation(0)
}

// 复位地图视图中心
const resetViewCenter = () => {
  view.setCenter(origin.pos)
}
</script>

<style lang="scss" scoped>
#layer_container{
  height: 100%;
  position: relative;
  #map_container{
    height: 100%;
  }
  .reset_orientation{
    width: 76px;    
    height: 76px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
    position: absolute;
    left: 20px;
    bottom: 715px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .floor_wrap{
    position: absolute;
    left: 20px;
    bottom: 200px;
    z-index: 99;
    background-color: #fff;
    border-radius: 40px;
    box-shadow: 0px 5px 9px 1px rgba(0, 0, 0, 0.22);
    padding: 10px;
    padding-bottom: 16px;
    .floor_item{
      width: 60px;
      height: 60px;
      border-radius: 30px;
      line-height: 60px;
      font-size: 30px;
      margin-top: 8px;
      background-color: #eee;
      color: #00DDC9;
    }
    .selected{
      background-color: #00DDC9;
      color: #fff;
    }
  }
  :deep(.input_wrap){
    // width: 100%; 
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    .el-input{
      .el-input__inner{
        height: 70px;
        line-height: 70px;
        font-size: 32px;
        border-radius: 10px;
        border: 1px solid #aaa;
        text-align: center;
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
        line-height: 600px;
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
    .img_wrap{
      margin: 0 15px;
    }
    .right_part{
      width: calc(100% - 115px);
      margin-left: 20px;
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
  }
}
</style>