export default [
  /**
   *  刷证比对结果两个页面
   */
  // 刷证比对成功页面
  {
    path: '/CardSearchSuccess/55',
    name: 'CardSearchSuccess55',
    component: () => import('../pages/55/contrastResult/CardSearchSuccess.vue')
  },
  // 刷证比对失败页面
  {
    path: '/CardSearchFailed/55',
    name: 'CardSearchFailed55',
    component: () => import('../pages/55/contrastResult/CardSearchFailed.vue')
  },
  // 航班时刻
  {
    path: '/FlightSchedule/55',
    name: 'FlightSchedule55',
    component: () => import('../pages/55/FlightSchedule.vue')
  },
  // 找美食
  {
    path: '/Food/55',
    name: 'Food55',
    component: () => import('../pages/55/Food.vue')
  },
  // 去购物
  {
    path: '/Shopping/55',
    name: 'Shopping55',
    component: () => import('../pages/55/Shopping.vue')
  },
  // 机场地图
  {
    path: '/AirportMap/55',
    name: 'AirportMap55',
    component: () => import('../pages/55/AirportMap.vue')
  },
  // 刷证页面（找值机柜台）
  {
    path: '/ScanCard/55',
    name: 'ScanCard55',
    component: () => import('../pages/55/ScanCard.vue')
  },
  // 智慧安检（快速安检）
  {
    path: '/FastSC/55',
    name: 'FastSC55',
    component: () => import('../pages/55/FastSC.vue')
  },
  /**
   * 刷证找登机口路由页下对应四种
   */
  {
    path: '/ScanCard/IDCard/55',
    name: 'IDCard55',
    component: () => import('../pages/55/scanCard/IDCard.vue')
  },
  {
    path: '/ScanCard/Passport/55',
    name: 'Passport55',
    component: () => import('../pages/55/scanCard/Passport.vue')
  },
  {
    path: '/ScanCard/HMPass/55',
    name: 'HMPass55',
    component: () => import('../pages/55/scanCard/HMPass.vue')
  },
  {
    path: '/ScanCard/BoardingCheck/55',
    name: 'BoardingCheck55',
    component: () => import('../pages/55/scanCard/BoardingCheck.vue')
  },
  /**
   * 四种栏目展示模板：无图 / 小图 / 大图 / 组合
   */
  {
    path: '/NoPicMode/55',
    name: 'NoPicMode55',
    component: () => import('../pages/55/categoryTemplate/NoPicMode.vue')
  },
  {
    path: '/SmallPicMode/55',
    name: 'SmallPicMode55',
    component: () => import('../pages/55/categoryTemplate/SmallPicMode.vue')
  },
  {
    path: '/BigPicMode/55',
    name: 'BigPicMode55',
    component: () => import('../pages/55/categoryTemplate/BigPicMode.vue')
  },
  {
    path: '/ComposedMode/55',
    name: 'ComposedMode55',
    component: () => import('../pages/55/categoryTemplate/ComposedMode.vue')
  }
]