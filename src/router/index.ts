import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import Home from '../pages/Home.vue'

// 几种不同位置的航显首页
import InternalMixedAreaHome from '../pages/32/InternalMixedAreaHome.vue'
import VIPHome from '../pages/32/VIPHome.vue'
import CheckInHome from '../pages/55/CheckInHome.vue'
import TrafficCenterHome from '../pages/55/TrafficCenterHome.vue'
import InternationalDepartureHome from '../pages/32/InternationalDepartureHome.vue'

// 所有32寸设备的路由页面
import routes32 from './routes_32'

// 所有55寸设备的路由页面
import routes55 from './routes_55'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/InternalMixedAreaHome'
  },
  // 国内混流区首页（32）
  {
    path: '/InternalMixedAreaHome', 
    name: 'InternalMixedAreaHome',
    component: InternalMixedAreaHome
  },
  // 贵宾厅首页（32）
  {
    path: '/VIPHome', 
    name: 'VIPHome',
    component: VIPHome
  },
  // 国际出发首页（32）
  {
    path: '/InternationalDepartureHome',
    name: 'InternationalDepartureHome',
    component: InternationalDepartureHome
  },
  // 值机区首页（55）
  {
    path: '/CheckInHome/55', 
    name: 'CheckInHome',
    component: CheckInHome
  },
  // 交通中心首页（55）
  {
    path: '/TrafficCenterHome/55', 
    name: 'TrafficCenterHome',
    component: TrafficCenterHome
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  ...routes32,
  ...routes55
]

const router: Router = createRouter({
  history: createWebHistory('/flight_display/'),
  routes
})

export default router