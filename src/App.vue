<!--
 * @Author: your name
 * @Date: 2020-05-11 10:56:47
 * @LastEditTime: 2020-05-11 11:34:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue\src\App.vue
 -->
<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
        <!--这里是会被缓存的组件-->
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" />
    </transition>
    <!--这里是不会被缓存的组件-->
    <div id="c"><%=strPower %></div>
  </div>
</template>

<script>
import { screenAdaptation } from './utils/tools'

export default {
  mounted () {
    screenAdaptation()
    if ('onorientationchange' in window) {
      window.addEventListener('resize', screenAdaptation, false)
    } else {
      window.addEventListener('resize', () => {
        screenAdaptation()
      }, false)
    }
  }
}
</script>
<style lang="less">
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.5s;
}

.router-fade-enter,
.router-fade-leave-to {
  opacity: 0;
}
</style>
