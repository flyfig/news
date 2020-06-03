<template>
  <div class="home">
    <div class="home_head u-flex-between ">
      <div class="logo">
        <img src="@/assets/img/logo.png">
      </div>
      <div class="home_head_share">
        <span class="iconfont iconfeiji" />
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" style="margin-top:0.88rem" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
       
      >
        <div class="home_menu">
          <div class="menu_item" @click="openReleaseList()">
           <!-- <input id="inputId" style="display: none;"  type="file"  multiple="multiple" accept="image/*;capture=camera"
            @change="handleFileChange($event)"> -->
            <div class="menu_item_icon">
              <span class="iconfont iconxiangji" />
              <div class="menu_label">
                <img class="u-wh100" src="@/assets/img/Add.png" alt="">
              </div>
            </div>
            <p>你的快拍</p>
          </div>
          <div class="menu_item" @click="link('/search')">
            <div class="menu_item_icon">
              <span class="iconfont iconsousuo" />
            </div>
            <p>搜索</p>
          </div>
        </div>

    <van-action-sheet v-model="showReleaseList" cancel-text="取消" :actions="releaseList" @select="selectRelease" @cancel="onCancelRelease" />

        <div v-for="(item,i) in list" :key="i" class="dynamic">
          <div class="dynamic_head u-flex-between ">
            <div class="dynamic_user u-flex-between ">
              <div class="dynamic_user_avatar">
                <img class="u-wh100" :src="$site+item.headImg">
              </div>
              <div class="dynamic_user_info">
                <p class="dynamic_user_name">
                  {{ item.authorName }}
                </p>
                <p class="dynamic_user_time">
                  {{ formatTime(item.createDate) }}
                </p>
              </div>
            </div>
            <div class="iconfont iconmore" @click="openshow(item.id)" />
          </div>
          <van-swipe v-if="item.thingResList.length>0" class="home_swipe" :style="item.thingResList.length>1?'padding-bottom: 0.6rem;':'padding-bottom: 0;'" indicator-color="#1a9b3f">
            <van-swipe-item v-for="(obj,index) in item.thingResList" :key="index">
              <img v-lazy="$site+obj.resUrl">
            </van-swipe-item>
          </van-swipe>
          <div class="dynamic_content">
            <div class="dynamic_msg u-flex-between">
              <div v-if="item.LikeList.length>0" class="dynamic_like">
                <div class="dynamic_like_user">
                  <div v-for="(likeItem,likeindex) in item.LikeList.slice(0,3)" :key="likeindex" class="dynamic_like_usee_avatar">
                    <img class="u-wh100" :src="$site+likeItem.likeImg">
                  </div>
                </div>
                <span>等{{ item.likeCount }}次赞</span>
              </div>
              <!-- 占位 -->
              <div v-else />
              <div class="dynamic_action">
                <span class="iconfont " :class="item.isLike?'iconxihuan1':'iconxihuan'" @click="like(item.id,item.isLike)" />
                <span class="iconfont iconxiaoxi" @click="opencomment(item.id)" />
                <span class="iconfont iconfenxiang" />
              </div>
            </div>
            <p class="dynamic_name">
              {{ item.contents }}
            </p>
            <p class="dynamic_text">
              描述
            </p>
            <div v-if="item.topicList.length>0" class="dynamic_label">
              <div v-for="(topitem,topindex) in item.topicList" :key="topindex" class="dynamic_label_item">
                <img src="@/assets/img/radio.png">
                <p>{{ topitem }}</p>
              </div>
            </div>
            <p class="comment_num">
              {{ item.commentCount>0?'共'+item.commentCount+'条评论':'暂无评论，赶快来抢沙发吧~' }}
            </p>
            <div v-if="item.commentCount>0" class="dynamic_comment">
              <div v-for="(comItem,comIndex) in item.commentList.slice(0,item.shownum)" :key="comIndex" v-longtap.prevent="{fn:showDelpopup,id:item.id}" class="dynamic_comment_item" @click="opencomment(item.id,comItem.id)">
                <div v-if="!comItem.contentId" class="dynamic_comment_item_user">
                  {{ comItem.commentName }}
                </div>
                <div v-else-if="comItem.contentId" class="dynamic_comment_item_user">
                  {{ comItem.commentName }}
                  <span>回复</span>
                  {{ comItem.contentId }}
                </div>
                <div class="dynamic_comment_item_value">
                  {{ comItem.commentContent }}
                </div>
              </div>
              <p v-if="item.shownum<item.commentList.length" class="dynamic_comment_more" @click="addNum(i)">
                查看更多评论
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show">
      <ul class="popup_list">
        <li @click="openDiolog">
          举报
        </li>
        <li @click="del">
          不看
        </li>
      </ul>
    </van-popup>
    <van-popup v-model="showDel">
      <ul class="popup_list">
        <li @click="delcomment">
          删除评论
        </li>
      </ul>
    </van-popup>
    <van-dialog v-model="showDialog" title="举报" show-cancel-button @confirm="diologConfirm">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入举报原因"
        show-word-limit
      />
    </van-dialog>
    <van-dialog v-model="showComment" title="评论" show-cancel-button @confirm="commentConfirm" @close="commentClose">
      <van-field
        v-model="commentContent"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入评论内容"
        show-word-limit
      />
    </van-dialog>
  </div>
</template>

<script lang="js">
import { getnews, apicomment, apilike, apiUnlike, deleteThing, apiDelComment } from '@/api'
import { formatDateTime, getDuration } from '@/utils/tools'
export default ({
  name: 'Home',
  data () {
    return {
      list: [],
      isLoading: false,
      loading: false,
      finished: false,
      params: {
        flag: 'thinglist',
        gameId: GetQueryString("gameId") ||GetQueryString("gameID") || 28,
        nowSize: 0
      },
      show: false,
      showDialog: false,
      showComment: false,
      message: '',
      commentContent: '',
      nowId: '',
      nowContentId: '',
      nowCommentId: '',
      showDel: false,
      //发布的菜单选项
      showReleaseList:false,
       releaseList:[{ name: '发布图片',value: '/release' }, { name: '发布视频' ,value: '/release_video'}],
    }
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    link (url) {
      this.$router.push(url)
    },
    onRefresh () {
      this.params.nowSize = 0
      this.list = []
      this.onLoad()
    },
    onLoad () {
      this.loading = true
      getnews(this.params).then(res => {
        if (res.data.code === 1) {
          this.loading = false
          this.isLoading = false
          var arr = res.data.listThing
          arr.forEach((item, i) => {
            arr[i].isLike = false
            arr[i].shownum = 3
          })
          this.list = this.list.concat(arr)
          if (res.data.listThing.length < 10) {
            this.finished = true
          } else {
            this.params.nowSize += res.data.listThing.length
          }
        } else {
          this.loading = false
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.finished = true
        this.loading = false
        this.isLoading = false
      })
    },
    addNum (index) {
      this.list[index].shownum += 3
    },
    formatTime (time) {
      if (new Date().getTime() - new Date(time).getTime() < 86400000) {
        return getDuration(new Date().getTime() - new Date(time).getTime(), true) + '小时前'
      }
      return formatDateTime(new Date(time), true)
    },
    openshow (id) {
      this.show = true
      this.nowId = id
    },
    openDiolog () {
      this.show = false
      this.showDialog = true
    },
    showDelpopup (e, obj) {
      this.showDel = true
      this.nowCommentId = obj.id
    },
    delcomment () {
      apiDelComment(this.nowCommentId).then(res => {
        console.log(res)
      })
    },
    del () {
      this.show = false
      deleteThing(this.nowId).then(res => {
        if (res.data.code === 1) {
          this.list.forEach((item, i) => {
            if (this.nowId === item.id) {
              this.list.splice(i, 1)
            }
          })
        }
      })
    },
    diologConfirm () {
      if (!this.message) {
        this.$toast('请输入举报原因')
        return
      }
      this.$toast('发送成功')
      this.message = ''
    },
    opencomment (id, contentId) {
      this.nowId = id
      if (contentId) {
        this.nowContentId = contentId
      }
      this.showComment = true
    },
    commentConfirm () {
      if (!this.commentContent) {
        this.$toast('请输入评论内容')
        return
      }
      apicomment({
        flag: 'thingComment',
        commentContent: this.commentContent,
        thingId: this.nowId,
        ContentId: this.nowContentId
      }).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.$toast(res.data.strMsg)
          this.onRefresh()
        } else {
          this.$toast(res.data.strMsg)
        }
      })
    },
    commentClose () {
      this.nowId = ''
      this.nowContentId = ''
      this.commentContent = ''
    },
    like (id, islike) {
      if (islike) {
        apiUnlike(id).then(res => {
          if (res.data.code === 1) {
            this.list.forEach((item, i) => {
              if (id === item.id) {
                this.list[i].isLike = false
                this.list[i].likeCount--
              }
            })
          } else {
            this.$toast(res.data.strMsg)
          }
        })
      } else {
        apilike(id).then(res => {
          console.log(res)
          if (res.data.code === 1) {
            this.list.forEach((item, i) => {
              if (id === item.id) {
                this.list[i].isLike = true
                this.list[i].likeCount++
              }
            })
          } else {
            this.$toast(res.data.strMsg)
          }
        })
      }
    },
    openReleaseList(){
     this.showReleaseList = !this.showReleaseList;
    },
    selectRelease(item){
      console.log(item);
      if(item.value){
        this.link(item.value);
      }
      //'/release'
      this.showReleaseList = !this.showReleaseList;
    },
    onCancelRelease(){
      Toast('取消');
    }
  }
})
</script>

<style lang="less" scoped>
.home_head{
  position: fixed;
  top: 0;
  left: 0;
  height: 88/@rem;
  width: 100%;
  padding: 0 32/@rem;
  background: #fff;
  box-shadow: 0 0 6/@rem 0	rgba(13, 4, 9, 0.16);
  font-size: @font_ord;
  z-index: 10;
  .logo{
    width: 204/@rem;
    height: 58/@rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .home_head_share span{
    font-size: @font_big;
    color: @font_col1;
    font-weight: bold;
  }
}

.home_menu{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 40/@rem 32/@rem 0;
  border-bottom: 1/@rem solid #eee;
  .menu_item{
    margin-right: 72/@rem;
    margin-bottom: 30/@rem;
    color: @font_col1;
    text-align: center;
    font-size: @font_ord1;
    &:nth-child(4n){
      margin-right: 0;
    }
    .menu_item_icon{
      position: relative;
      margin-bottom: 20/@rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width:114/@rem;
      height: 114/@rem;
      background: #eee;
      border-radius: 50%;
      .iconfont{
        font-size: 50/@rem;
      }
      .menu_label{
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: 32/@rem;
        height: 32/@rem;
      }
    }
  }
}

.dynamic{
  margin-bottom: 20/@rem;
  .dynamic_head{
    padding: 40/@rem 34/@rem 30/@rem;
    .dynamic_user_avatar{
      margin-right: 24/@rem;
      width: 68/@rem;
      height: 68/@rem;
      border-radius: 50%;
      overflow: hidden;
    }
    .dynamic_user_info{
      color: @font_col2;
      .dynamic_user_name{
        margin-bottom: 10/@rem;
        color: @font_col1;
        font-size: @font_title;
        font-weight: bold;
      }
    }
    .iconmore{
      color: #333;
      font-size: 40/@rem;
      font-weight: bold;
    }
  }
  .dynamic_content{
    padding: 0 34/@rem;
    color: @font_col1;
    .dynamic_msg{
      margin: 20/@rem 0 30/@rem;
      color: @font_col1;
      font-size: @font_title;
      .dynamic_like{
        display: flex;
        align-items: center;
        font-weight: bold;
      }
      .dynamic_like_user{
        margin-right: 22/@rem;
        display: flex;
        align-items: center;
        .dynamic_like_usee_avatar{
          margin-left: -10/@rem;
          width: 42/@rem;
          height: 42/@rem;
          border: 1/@rem solid #fff;
          border-radius: 50%;
          overflow: hidden;
          &:first-child{
            margin-left: 0;
          }
        }
      }
      .dynamic_action .iconfont{
        font-size: 48/@rem;
        margin-left:60/@rem;
        &.iconxiaoxi{
          font-size: 52/@rem;
        }
        &.iconxihuan1{
          color:#d81e06
        }
        &.iconfenxiang{
          font-size: 58/@rem;
        }
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .dynamic_name{
      font-size: @font_title2;
      font-weight: bold;
    }
    .dynamic_text{
      margin: 30/@rem 0;
      font-size: 26/@rem;
    }
    .dynamic_label{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .dynamic_label_item{
        display: flex;
        align-items: center;
        padding: 4/@rem;
        padding-right: 20/@rem;
        margin-right: 16/@rem;
        height: 32/@rem;
        color: #1a9b3f;
        background: #bae1c5;
        border-radius: 16/@rem;
        font-size: @font_text2;
        img{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8/@rem;
          width: 24/@rem;
          height: 24/@rem;
          background: #fff;
          font-size: 20/@rem;
          border-radius: 50%;
        }
      }
    }
    .comment_num{
      margin: 30/@rem 0;
      color: @font_col2;
      font-size: @font_text2;
    }
    .dynamic_comment_item{
      margin-top: 20/@rem;
      display: flex;
      color: @font_col1;
      font-size: @font_ord1;
      .dynamic_comment_item_user{
        margin-right: 24/@rem;
        font-weight: bold;
      }
      .dynamic_comment_item_value{
        flex: 1;
      }
    }
    .dynamic_comment_more{
      margin-top: 20/@rem;
      color:#1a9b3f;
    }
  }
}

.home_swipe{
  padding-bottom: 60/@rem;
  width: 100%;
  height: 820/@rem;
  img{
    width: 100%;
    height: 100%;
  }
}

.popup_list{
  width: 500/@rem;
  li{
    padding: 20/@rem ;
    font-size: 28/@rem;
    color: #333;
  }
}
</style>
