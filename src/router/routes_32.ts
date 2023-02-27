export default [
  /**
   * 三个搜索结果页面
   */
  // 刷脸 / 刷证比对成功页面
  {
    path: '/SearchSuccess',
    name: 'SearchSuccess',
    component: () => import('../pages/32/contrastResult/SearchSuccess.vue')
  },
  // 刷脸比对失败页面
  {
    path: '/FaceSearchFailed',
    name: 'FaceSearchFailed',
    component: () => import('../pages/32/contrastResult/FaceSearchFailed.vue')
  },
  // 刷证比对失败页面
  {
    path: '/CardSearchFailed',
    name: 'CardSearchFailed',
    component: () => import('../pages/32/contrastResult/CardSearchFailed.vue')
  },

  /**
   * 其他普通路由页
   */
  // 刷脸页面
  {
    path: '/ScanFace',
    name: 'ScanFace',
    component: () => import('../pages/32/ScanFace.vue')
  },
  // 刷证找登机口
  {
    path: '/ScanCard',
    name: 'ScanCard',
    component: () => import('../pages/32/ScanCard.vue')
  },
  // 机场出口
  {
    path: '/AirportExit',
    name: 'AirportExit',
    component: () => import('../pages/32/AirportExit.vue')
  },
  // 机场地图
  {
    path: '/AirportMap',
    name: 'AirportMap',
    component: () => import('../pages/32/AirportMap.vue')
  },
  // 找美食
  {
    path: '/Food',
    name: 'Food',
    component: () => import('../pages/32/Food.vue')
  },
  // 去购物
  {
    path: '/Shopping',
    name: 'Shopping',
    component: () => import('../pages/32/Shopping.vue')
  },
  // 航班时刻
  {
    path: '/FlightSchedule',
    name: 'FlightSchedule',
    component: () => import('../pages/32/FlightSchedule.vue')
  },
  /**
   * 机器人召唤过程中显示实时位置的页面
   */
  {
    path: '/CallingRobot',
    name: 'CallingRobot',
    component: () => import('../pages/32/CallingRobot.vue')
  },
  /**
   * 刷证找登机口路由页下对应四种
   */
  {
    path: '/ScanCard/IDCard',
    name: 'IDCard',
    component: () => import('../pages/32/scanCard/IDCard.vue')
  },
  {
    path: '/ScanCard/Passport',
    name: 'Passport',
    component: () => import('../pages/32/scanCard/Passport.vue')
  },
  {
    path: '/ScanCard/HMPass',
    name: 'HMPass',
    component: () => import('../pages/32/scanCard/HMPass.vue')
  },
  {
    path: '/ScanCard/BoardingCheck',
    name: 'BoardingCheck',
    component: () => import('../pages/32/scanCard/BoardingCheck.vue')
  },
  /**
   * 四种栏目展示模板：无图 / 小图 / 大图 / 组合
   */
  {
    path: '/NoPicMode',
    name: 'NoPicMode',
    component: () => import('../pages/32/categoryTemplate/NoPicMode.vue')
  },
  {
    path: '/SmallPicMode',
    name: 'SmallPicMode',
    component: () => import('../pages/32/categoryTemplate/SmallPicMode.vue')
  },
  {
    path: '/BigPicMode',
    name: 'BigPicMode',
    component: () => import('../pages/32/categoryTemplate/BigPicMode.vue')
  },
  {
    path: '/ComposedMode',
    name: 'ComposedMode',
    component: () => import('../pages/32/categoryTemplate/ComposedMode.vue')
  }
]