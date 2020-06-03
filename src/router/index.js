/*
 * @Author: your name
 * @Date: 2020-05-11 10:56:49
 * @LastEditTime: 2020-05-28 10:31:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/views/Layout.vue'
import Home from '@/views/tabs/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: layout,
    children: [
      // 首页
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          keepAlive: true
        }
      },
      // 新鲜事
      {
        path: '/merchant',
        name: 'merchant',
        component: () => import(/* webpackChunkName: "about" */ '../views/tabs/Merchant.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/search',
        name: 'search',
        component: () => import(/* webpackChunkName: "about" */ '../views/pages/search.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/release',
        name: 'release',
        component: () => import(/* webpackChunkName: "about" */ '../views/pages/release.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/release_video',
        name: 'release_video',
        component: () => import(/* webpackChunkName: "about" */ '../views/pages/release_video.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/search1',
        name: 'search1',
        component: () => import(/* webpackChunkName: "about" */ '../views/pages/search1.vue'),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  //mode: 'hash',
  mode: 'history',
  //base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
