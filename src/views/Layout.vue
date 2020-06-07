<!--
 * @Author: your name
 * @Date: 2020-01-13 11:45:26
 * @LastEditTime: 2020-05-28 10:07:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user\src\views\Layout.vue
 -->
<template>
  <div class="layout">
    <div class="warp">
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
    </div>
    <div class="nav">
      <router-link class="link" to="/home">
        <span class="iconfont iconshouye" />
        <p>首页</p>
      </router-link>
      <router-link class="link" to="/merchant">
        <span class="iconfont iconaixin" />
        <p>赛事列表</p>
      </router-link>
      <router-link class=" link" to="/merchant">
        <img class="nav_center_img" src="@/assets/img/Add.png" alt="">
        <p>创建赛事</p>
      </router-link>
      <router-link class="link" to="/merchant">
        <span class="iconfont iconpaihang" />
        <p>排行榜</p>
      </router-link>
      <router-link class="link" to="/merchant">
        <span class="iconfont iconwode" />
        <p>我的</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="js">
import { getWxUser } from '@/api'
export default ({
     data () {
      return {
        userInfo:{}
      }
     },
      mounted() {
        this.onLoad();
      },
      methods:{
         onLoad () {
      var params = {
      reditUrl:window.location.href
      }
      getWxUser(params).then(res => {
        if(res.data.id){
          this.userInfo = res.data;
        }
      }).catch(err => {
        // setTimeout(() => {
        //   this.onLoad();
        // }, 2000);
      })
    },
      }
})
</script>

<style lang="less" scoped>
.layout{
  display: flex;
  flex-direction: column;
  // height: 100%;
  // .warp{
  //   height: calc( 100% - 0.98rem );
  //   overflow: auto;
  // }
}
.nav{
  padding-top: 36/@rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 124/@rem;
  background-image: url('~@/assets/img/footer.png');
  background-color: transparent;
  background-size: 100% 100%;
  z-index: 2;
  .link{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    width: 20%;
    height: 100%;
    .nav_center_img{
      margin-top: -26/@rem;
      width: 76/@rem;
      height: 76/@rem;
    }
    span{
      font-size: 46/@rem;
    }
    &.router-link-active{
      color: #111111;
    }
  }

}
</style>
