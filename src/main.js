/*
 * @Author: your name
 * @Date: 2020-01-13 11:45:24
 * @LastEditTime: 2020-05-28 10:15:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config.json'
import './assets/less/global.css'
import './assets/font/iconfont.css'
import 'vant/lib/index.css'
import './utils/event.js'
import waterfall from 'vue-waterfall2'
import { Swipe, SwipeItem, List, PullRefresh, RadioGroup, Radio, Loading, Image, Lazyload, Tab, Tabs, Popup, Field, Dialog, Toast, ImagePreview, Uploader, DropdownMenu, DropdownItem, ActionSheet, Notify } from 'vant'
Vue.use(Swipe).use(SwipeItem).use(List).use(PullRefresh).use(RadioGroup).use(Radio).use(Loading).use(Image).use(Lazyload).use(Tab).use(Tabs).use(Popup).use(Field).use(Dialog).use(Toast).use(ImagePreview).use(Uploader).use(Notify).use(DropdownMenu).use(DropdownItem).use(ActionSheet)

Vue.config.productionTip = false
Vue.use(waterfall)
Vue.prototype.$site = config.site

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
