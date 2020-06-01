<template>
  <div class="search">
    <div class="search_head">
      <span class="iconfont iconfanhui" @click="$router.back()" />
      <div class="search_ipt">
        <span class="iconfont iconsousuo" />
        <form
          action="javascript:return true;"
          @submit.prevent
        >
          <input ref="searchInput" v-model="params.search" type="search" placeholder="搜索用户、动态和主题" @keyup.13="search">
        </form>
      </div>
      <span class="iconfont iconsaoyisao" />
    </div>
    <div class="search_scroll">
      <div class="search_tabs" :style="{'width':width}">
        <div v-for="(item,i) in Tabs" :key="i" class="search_tab" :class="{'active':tabindex===i}" @click="tabChange(i)">
          <span class="iconfont u-cenInBlock" :class="item.icon" />
          <p class="u-cenInBlock">
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="img_warp">
          <div v-for="(item,i) in imgList" v-show="imgList.length>0" :key="i" class="img_list" :class="{'bigImg':item.type===2}">
            <img v-lazy="item.resUrl" @click="prevImg(item.resUrl)">
            <img class="img_label" :src="item.type===2?Videolabel:Imglabel">
          </div>
        </div>
        <div class="img_warp1">
          <div v-for="(item,i) in videoList" v-show="videoList.length>0" :key="i" class="img_list" :class="{'bigImg':item.type===2}">
            <video ref="video" loop muted class="video" width="100%" height="100%" :src="item.resUrl" @click="handleVideo" />
            <img class="img_label" :src="item.type===2?Videolabel:Imglabel">
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" @close="popupClose">
      <video ref="bigvideo" :src="bigVideo" loop />
    </van-popup>
  </div>
</template>

<script lang="js">
import Imglabel from '@/assets/img/Img.png'
import Videolabel from '@/assets/img/video.png'
import { ImagePreview } from 'vant'
// import { getnews } from '@/api'
import mock from '@/mock.json'
export default ({
  name: 'Home',
  data () {
    return {
      list: [],
      Tabs: [
        { id: 1, name: '推荐', icon: 'icontuijian' },
        { id: 2, name: '直播', icon: 'iconlive' },
        { id: 3, name: '购物', icon: 'icongouwu' },
        { id: 4, name: '旅行', icon: 'iconlvxing' },
        { id: 5, name: '推荐', icon: 'icontuijian' }
      ],
      isLoading: false,
      loading: false,
      finished: false,
      tabindex: 0,
      num: 0,
      Imglabel,
      Videolabel,
      params: {
        flag: 'thinglist',
        gameId: 28,
        nowSize: 0,
        search: ''
      },
      bigVideo: '',
      show: false,
      element: '',
      videoList: [],
      imgList: []
    }
  },
  computed: {
    width () {
      return (((this.Tabs.length * 160) + (this.Tabs.length - 1) * 32) + 20) / 100 + 'rem'
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scroll)
  },
  methods: {
    scroll (el) {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      const arr = this.$refs.video
      let flag = true
      arr.forEach((item, i) => {
        if (this.getElementToPageTop(item) - scrollTop > 300 && this.getElementToPageTop(item) - scrollTop < 500 && flag) {
          arr.forEach(obj => {
            obj.pause()
          })
          flag = false
          item.play()
        }
      })
    },
    getElementToPageTop (el) {
      if (el.parentElement) {
        return this.getElementToPageTop(el.parentElement) + el.offsetTop
      }
      return el.offsetTop
    },
    onRefresh () {
      this.params.nowSize = 0
      this.finished = false
      this.list = []
      this.imgList = []
      this.videoList = []
      this.onLoad()
    },
    onLoad () {
      this.loading = true
      // getnews(this.params).then(res => {
      //   this.loading = false
      //   this.isLoading = false
      //   if (res.data.code === 1) {
      //     this.params.search = ''
      //     this.list = this.list.concat(res.data.listThing)
      //     if (res.data.listThing.length < 10) {
      //       this.finished = true
      //     } else {
      //       this.params.nowSize += res.data.listThing.length
      //     }
      //   }
      // }).catch(() => {
      //   this.loading = false
      //   this.isLoading = false
      //   this.finished = true
      // })

      // 模拟
      setTimeout(() => {
        this.loading = false
        this.isLoading = false
        mock.listThing.forEach(item => {
          if (item.thingResList[0].type === 1) {
            this.imgList.push(item.thingResList[0])
          } else {
            this.videoList.push(item.thingResList[0])
          }
        })
        // this.list = this.list.concat(mock.listThing)
        if (this.list.length > 12) {
          this.finished = true
        }
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop

        this.$nextTick(() => {
          if (this.getElementToPageTop(this.$refs.video[0]) - scrollTop > 0 && this.getElementToPageTop(this.$refs.video[0]) - scrollTop < 500) {
            this.$refs.video[0].play()
          }
        })
      }, 500)
    },
    tabChange (index) {
      this.tabindex = index
    },
    prevImg (src) {
      ImagePreview([src])
    },
    handleVideo (e) {
      const src = e.target.src
      e.target.pause()
      this.element = e.target
      this.show = true
      this.bigVideo = src
      this.$nextTick(() => {
        this.$refs.bigvideo.play()
      })
    },
    popupClose () {
      this.element.play()
    },
    async search () {
      this.params.nowSize = 0
      this.list = []
      this.onLoad()
      this.$refs.searchInput.blur()
    }
  }
})
</script>

<style lang="less" scoped>
.search_head{
    display: flex;
    align-items: center;
    height: 88/@rem;
    width: 100%;
    padding: 0 30/@rem;
    background: #fff;
    font-size: @font_ord;
    z-index: 10;
    .iconfanhui{
        margin-right: 34/@rem;
        color: @font_col2;
        font-size: 40/@rem;
    }
    .search_ipt{
        padding: 0 24/@rem;
        margin-right: 40/@rem;
        display: flex;
        align-items: center;
        height: 56/@rem;
        width: 540/@rem;
        background: #eee;
        border-radius: 28/@rem;
        .iconsousuo{
            margin-right: 16/@rem;
            color: #bbbbbb;
            font-size: 34/@rem;
        }
        input{
            flex: 1;
        }
    }
    .iconsaoyisao{
        color: #070707;
        font-size: 46/@rem;
        font-weight: bold;
    }
}
.search_scroll{
    width: 100%;
    overflow-x: auto;
}
.search_tabs{
    padding: 20/@rem 34/@rem;
    overflow: hidden;
    .search_tab{
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16/@rem;
        width: 160/@rem;
        height: 54/@rem;
        color: @font_col1;
        font-size: @font_title;
        border: 1/@rem solid #ccc;
        border-radius: 8/@rem;
        &.active{
            color: #1a9b3f;
            border-color: #1a9b3f;
            .iconfont{
                color: #1a9b3f;
            }
        }
        &:last-child{
            margin-right: 0;
        }
        .iconfont{
            margin-right: 16/@rem;
            color: #000;
            font-size: 40/@rem;
            &.icongouwu{
                font-size: 34/@rem;
            }
        }
    }
}
.img_warp,.img_warp1{
  padding-right: 2/@rem;
  float: left;
  width: 40%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.img_warp1{
  padding-right: 0;
  padding-left: 2/@rem;
width: 60%;
}
.img_list{
  display: block;
  float: left;
  margin-bottom: 4/@rem;
  position: relative;
  width: 100%;
  margin:2/@rem;
  &.bigImg{
    margin-right: 0;
    width: auto;
    max-width: 496/@rem;
    min-width: 244/@rem;
    div{
      width: 100%;
      height: 100%;
    }
  }
  img{
    width: 100%;
    height: 100%;
  }
  video{
    height: 100%;
  }
  .img_label{
    position: absolute;
    top: 16/@rem;
    right: 16/@rem;
    width: 42/@rem;
    height: 32/@rem;
  }
}
</style>
