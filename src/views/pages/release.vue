<template>
  <div class="release">
    <div class="head">
      <span class="iconfont iconfanhui" @click="$router.back()" />

      <button class="release-send weui-btn_primary" @click="sendImage">发表</button>
    </div>
    <div class="textarea-li">
      <textarea class="textarea" placeholder="这一刻的想法" v-model="newThing"></textarea>
    </div>

    <div class="img-list">
      <label></label>
      <div
        class="img-item"
        v-for="(item,index) in imgList"
        :key="index"
        :style="'background-image:url('+item + ')'"
        @click.stop="setPreView(index)"
      >
        <span class="delete-image" @click.stop="deleteImage(index)">
          <i class="iconfont el-icon-delete"></i>
        </span>
        <!-- <img :src="item" /> -->
      </div>

      <div class="img-add" @click.stop="chooseImage($event,)" v-show="imgList.length < 4">
        <input
          ref="inputImage"
          multiple="multiple"
          @change="selectImage($event)"
          @click="$event.target.files=null"
          style="display: none;"
          type="file"
          accept="image/*;capture=camera"
        />
      </div>
      <div class="video-item" v-show="videoFile"></div>
    </div>

    <!-- 预览页面             -->
    <div class="preview" v-show="imgList.length">
      <div class="to-pre" :class="curPreViewIndex !=0 ? '':'no-next'" @click="toPre()">
        <span class="iconfont iconfanhui" />
      </div>
      <div
        class="to-next"
        :class="(curPreViewIndex ==imgList.length -1 || 1 >=imgList.length) ? 'no-next':''"
        @click="toNext()"
      >
        <span class="iconfont iconfanhui" />
      </div>
      <img :src="curPreViewImage" v-show="curPreViewImage" />
    </div>
  </div>
</template>

<script lang="js">
import Imglabel from '@/assets/img/Img.png'
import Videolabel from '@/assets/img/video.png'
import { Toast } from 'vant'
import { apiWxJSAPI } from '@/api'
import { publishNewThing } from '@/api'
import axios from 'axios'
// import mock from '@/mock.json'
export default ({
  name: 'release',
  data () {
    return {
      curPreViewImage:null,
      curPreViewIndex:0,
      imgList:[],
      gameId: GetQueryString("gameId") ||GetQueryString("gameID") || -1,
      videoFile:null,
       //微信分享参数
        appid: null,
        timestamp: null,
        nonceStr: null,
        signature: null,
        isWxChoose: false,
        newThing:null,
    }
  },
  computed: {
  
  },
  watch:{
    imgList(newVal,oVal){
      var size = newVal.length;
      if(size == 0){
 this.curPreViewImage = null;
       this.curPreViewIndex = 0;
      }else{
 this.curPreViewImage = newVal[size -1];
       this.curPreViewIndex = size -1;
      }
      
    }
  },
  mounted () {
    this.wxInit();
  },
  destroyed () {
    
  },
  methods: {
     test:function(){
         alert(88)
     },
     //微信功能初始化
      wxInit: function () {
         apiWxJSAPI(this.params).then(res => {
        
         this.appid = res.data.appid;
      this.timestamp = res.data.timestamp;
      this.nonceStr = res.data.nonceStr;
      this.signature = res.data.signature;
      var that = this;
        wx.config({
            debug: false, // 是否开启调试模式
            appId: that.appid, //appid
            timestamp: that.timestamp, // 时间戳
            nonceStr: that.nonceStr, // 随机字符串
            signature: that.signature, // 签名
            jsApiList: [
            "checkJsApi",
            "chooseImage",
            "getLocalImgData"
            ] // 需要使用的JS接口列表
        });
       wx.checkJsApi({
            jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                "checkJsApi",
                  
                  "chooseImage",
                  "getLocalImgData"
            ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                console.log(res);
                that.isWxChoose = true; //判断是否可以调用wx js_api  false:不可调用

                //  $("#uploaderInput").hide();
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            },
            error:function(res){
              console.log(res);
              that.isWxChoose = false; 
            },

        });
        wx.error(function (res) {
            console.log(res);
            that.isWxChoose = false; //判断是否可以调用wx js_api  false:不可调用
            //   $("#uploaderInput").show();
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });
          
      },

    chooseImage: function (event) {

        var dom = event.target;
        var that = this;
        if (this.isWxChoose) {
          
            this.selectImageByWx(that);
        } else {
          var input = event.target.getElementsByTagName('input');
          if(input && input.length){
            input[0].click();
          }
            
        }
    },

    selectImageByWx: function (that) {               
                wx.chooseImage({
                    count: 4, // 默认9
                    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有sourceType: ['camera','album'];
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    
                        if (localIds && localIds.length) {
                          for(var i=0;i<localIds.length;i++){
                            var localId = localIds[i];
                            console.log(localId);
                            wx.getLocalImgData({
                                localId: localId, // 图片的localID
                                success: function (res) {
                                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                    if (localData.indexOf('data:image') != 0) {
                                        //判断是否有这样的头部
                                        localData = 'data:image/jpeg;base64,' + localData
                                    }
                                    
                                    localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg');
                                  if(that.imgList.length <4){
                                    that.imgList.push(localData);
                                  }  
                                }
                            });
                          }                                
                        }
                    }
                });
                

            },
            //清除input的内容
            clearInputImage:function(){
              this.$refs.inputImage.val('');
            },
            //添加球队logo
            selectImage: function (e) {
                var files = e.target.files;
                var that = this;
                var maxLength = 4;
                if (files && files.length) {
                  if(files.length < maxLength){
                    maxLength=files.length;
                  }
                    for(var i=0;i<maxLength;i++){
                    if(files[i].type.indexOf('image') == -1){
                      maxLength++;
                      continue;
                    }
                    var reader = new FileReader();

                    reader.onload = function (ee) {
                        if(that.imgList.length <4){
                          
                          that.dealImage(ee.target.result,1080,function(data){
                            that.imgList.push(data);
                          })
                        }
                        
                    }
                    reader.readAsDataURL(files[i]);
                    }
                        
                } else {
                  //   $.alert("图片不符合规则");
                }
            },
            //将base64转换为文件对象
    dataURLtoFile:function (urlData, filename) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        if((filename + '').indexOf('.')== -1){
          filename += '.' + mime.split('/')[1];
        }
        //转换成file对象   转换成成blob对象  return new Blob([u8arr],{type:mime});
        return new File([u8arr], filename, {
            type: mime
        });
    },
     //压缩方法 base64图片数据， w：图片宽度，callback回调函数
      dealImage: function (base64, w, callback) {
          var newImage = new Image();
          var quality =  0.6   //压缩系数0-1之间
          newImage.src = base64;
          newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
          var imgWidth, imgHeight;
          newImage.onload = function () {
              imgWidth = this.width;
              imgHeight = this.height;
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              if (Math.max(imgWidth, imgHeight) > w) {
                  if (imgWidth > imgHeight) {
                      canvas.width = w;
                      canvas.height = w * imgHeight / imgWidth;
                  } else {
                      canvas.height = w;
                      canvas.width = w * imgWidth / imgHeight;
                  }
                  canvas.width = w;
                      canvas.height = w * imgHeight / imgWidth;
              } else {
                  canvas.width = imgWidth;
                  canvas.height = imgHeight;
                  quality = 0.6;
              }
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
              var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
              // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
              // while (base64.length / 1024 > 150) {
              // 	quality -= 0.01;
              // 	base64 = canvas.toDataURL("image/jpeg", quality);
              // }
              // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
              // while (base64.length / 1024 < 50) {
              // 	quality += 0.001;
              // 	base64 = canvas.toDataURL("image/jpeg", quality);
              // }
              callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
          }
      },
    deleteImage:function(index){
        this.imgList.splice(index,1);
    },
    toPre:function(){
        if(this.imgList.length){
          if(this.curPreViewIndex > 0){
            this.curPreViewIndex--;
            this.curPreViewImage = this.imgList[this.curPreViewIndex];
          }
        }
    },
    toNext:function(){
      if(this.imgList.length){
        if(this.curPreViewIndex <this.imgList.length -1){
          this.curPreViewIndex++;
          this.curPreViewImage = this.imgList[this.curPreViewIndex];
        }
      }
    },
    setPreView:function(index){
      this.curPreViewIndex = index;
      this.curPreViewImage = this.imgList[index];
    },

    //发布图文消息
    sendImage:function(){
      if(!this.newThing || this.newThing == ''){
          Toast('您不打算添加点文字吗？');
          return;
      }
      var files = this.imgListToFile();

        var form = new FormData();
      form.append('gameId',this.gameId);
      form.append('newThing',this.newThing);
      if(files){
        form.append('type',1);
        for(var i=0;i<files.length;i++){
          form.append('files',files[i]);
        }
      }

      var  config = {
        //formData  提交请求头有两种 multipart/form-data  和 application/x-www-form-urlencoded
        // multipart/form-data   用于type=file 的input提交
        headers: {
                "Content-Type": "multipart/form-data"
        }
      };
 
      axios.post("/myInterFace/NewThing.ashx?flag=publishNewThing", form, config).then(res => {
                Toast.success(res.data.strMsg);
                setTimeout(() => {
                  this.$router.push('/home')
                }, 2500);
      }).catch(error => {
          Toast.fail(res.data.strMsg)
      });
    },
    imgListToFile:function(){
        var files = null;
        if(this.imgList.length){
          files = [];
          for(var i=0;i<this.imgList.length;i++){
            var file = this.dataURLtoFile(this.imgList[i], i);
            files.push(file);
          }
        }
        return files;
    }
  }
})
</script>

<style  scoped>
.release {
  width: 100%;
  height: 100%;
}
.iconfanhui {
  margin-right: 0.4rem;
  color: #999999;
  font-size: 0.5rem;
  margin-top: 8px;
  margin-left: 6px;
}
.release-send {
  font-size: 0.37rem;
  background: #1aad19;
  color: #fff;
  border-radius: 5px;
  padding: 0.05rem 0.4rem;
  right: 10px;
  position: absolute;
  top: 10px;
}
.textarea-li {
  height: 100px;
  width: calc(100% - 20px);
  margin-left: 10px;
}
.textarea-li textarea {
  width: 100%;
  height: 100%;
}
.img-list {
  min-height: 80px;
  width: 100%;
  display: inline-flex;
  padding: 0 0 0 10px;
}
.img-item,
.img-add,
.video-item {
  width: 80px;
  margin-right: 10px;
  border: 1px solid #f4f4f4;
  height: 80px;
  background: #f8f8f8;
  position: relative;
  display: inline-block;
}
.img-item img {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  display: block;
}
.img-add::before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
  width: 39.5px;
  height: 2px;
}
.img-add::after {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;

  width: 2px;
  height: 39.5px;
}
.img-item {
  color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.delete-image {
  color: #fff;
  width: 20px;
  height: 22px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  background-color: rgba(100, 100, 100, 0.7);
}

.preview {
  width: 100%;
  height: calc(100% - 220px);
  margin-top: 10px;
  position: relative;
  margin-bottom: 1.3rem;
  box-shadow: 0 0px 5px #888888;
  overflow-x: hidden;
}
.preview .to-pre,
.preview .to-next {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: rgba(100, 100, 100, 0.7);
  border-radius: 100%;
  top: 100px;
  left: 10px;
}
.preview .to-next {
  right: 10px;
  left: auto;
}
.preview .to-next .iconfont,
.preview .to-pre .iconfont {
  color: #fff;
  font-size: 23px;
}
.preview .to-next .iconfont {
  transform: rotate(180deg);
  margin-left: 10px;
}
.preview .no-next {
  background-color: rgba(200, 200, 200, 0.5);
}
.preview .no-next .iconfont {
  color: #bababa;
}
.preview img {
      max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
}
</style>
