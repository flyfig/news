
//从URL中回去相应参数值
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = (window.location.search+'').substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(r[2]); return null;
}
//封装ajax方法，
function post_async(url, param, callback, errorCallback, dataType, timeout) { $.ajax({ url: url, type: "POST", data: param, ContentType: dataType || "application/json", dataType: "json", timeout: timeout || 60000, success: function (e) { if (callback && typeof callback == "function") { callback(e) } }, error: function (err) { console.log(err); if (errorCallback && typeof errorCallback == "function") { errorCallback() } } }) }

function get_async(url, callback, errorCallback, dataType, timeout) { $.ajax({ url: url, type: "GET", ContentType: dataType || "application/json", timeout: timeout || 60000, success: function (e) { $(".body-loading").hide(); if (callback && typeof callback == "function") { callback(e) } }, error: function (err) { console.log(err); if (errorCallback && typeof errorCallback == "function") { errorCallback() } } }) }

function get_async_param(url,param, callback, errorCallback, dataType, timeout) {
    $.ajax({
        url: url,
        type: "GET",
		data:param,
        ContentType: dataType || "application/json",
        timeout: timeout || 60000,
        success: function (e) {
            $(".body-loading").hide();
            if (callback && typeof callback == "function") {
                callback(e)
            }
        },
        error: function (err) {
            console.log(err);
            if (errorCallback && typeof errorCallback == "function") {
                errorCallback()
            }
        }
    })
}
//往url里添加/修改参数
function updateQueryStringParameter(uri, key, value) {
    if(!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

//从url里删除参数
function delParam(url,paramKey) {
    var url = url;    //页面url
    var urlParam = url.substr(url.indexOf('?')+1);   //页面参数
    var beforeUrl = url.substr(0, url.indexOf("?"));   //页面主地址（参数之前地址）
    var nextUrl = "";
    var form = null;
    var arr = new Array();
    if (urlParam != "") {
        var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
        for (var i = 0; i < urlParamArr.length; i++) {
            var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
            //如果键雨要删除的不一致，则加入到参数中
            if (paramArr[0] != paramKey) {
                arr.push(urlParamArr[i]);
            }
        }
    }
    if (arr.length > 0) {
        nextUrl = "?" + arr.join("&");
    }
    url = beforeUrl + nextUrl;
    return url;
}

        /*
 * iOS12以上版本，微信打开链接点击输入框获取焦点后虚拟键盘自动弹出
 * 收起键盘，原来弹出键盘的位置一片空白，页面没有自动适应整个屏幕
 * 解决办法：
 * 在当前页面滚动的位置上下滚动1px的距离即可实现页面的自适应
 */
document.body.addEventListener('focusout', function() {
    //软键盘收起的事件处理
   var ua = window.navigator.userAgent;
   var app = window.navigator.appVersion;
   //$alert('浏览器版本: ' + app + '\n' + '用户代理: ' + ua);
   if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
       //$alert('ios端');
   var currentPosition, timer;
   var speed = 1;
   timer = setInterval(function() {
       currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
       currentPosition -= speed;
       window.scrollTo(0, currentPosition); //页面向上滚动
       currentPosition += speed;
       window.scrollTo(0, currentPosition); //页面向下滚动
       clearInterval(timer);
   }, 100);
   } else if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
       //$alert('android端');
   }
})


function changeURLPar(destiny, par, par_value) {
    var pattern = par + '=([^&]*)';
    var replaceText = par + '=' + par_value;
    if (destiny.match(pattern)) {
        var tmp = '/\\' + par + '=[^&]*/';
        tmp = destiny.replace(eval(tmp), replaceText);
        return (tmp);
    } else {
        if (destiny.match('[\?]')) {
            return destiny + '&' + replaceText;
        } else {
            return destiny + '?' + replaceText;
        }
    }
    return destiny + '\n' + par + '\n' + par_value;
}

function urlDelP(url, name) {
    var urlArr = url.split('?');
    if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
        var query = urlArr[1];
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var urlte = urlArr[0] + '?' + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return urlte;
    } else {
        return url;
    };
}

function RouterLink (route) {
    if (!route) return
    if (typeof route === 'string' && route.indexOf('miniapp://') === 0) {
      window.wx.miniProgram.reLaunch({ url: route.replace('miniapp://', '/') })
    } else if (
      typeof route === 'string' && (route.indexOf('http') === 0 || route.indexOf('/api') === 0)
    ) {
      location.href = route
    } else {
      router.push(route)
    }
  }
  
  function screenAdaptation () {
    var clientW = document.body.clientWidth
    var scale = 750 / 100 // 当屏幕 = 640px时，html根字体 = 100px
    document.getElementsByTagName('html')[0].style.fontSize = `${clientW / scale}px`
  }
  
  function merge (target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
      var source = arguments[i] || {}
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var value = source[prop]
          if (value !== undefined) {
            target[prop] = value
          }
        }
      }
    }
    return target
  }
  
  function formatDateTime (date, showTime) {
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = date.getMinutes()
    minute = minute < 10 ? ('0' + minute) : minute
    var second = date.getSeconds()
    second = second < 10 ? ('0' + second) : second
    if (showTime) {
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    } else {
      return y + '-' + m + '-' + d
    }
  }
  
  function getDuration (my_time, onlyhours) {
    var days = my_time / 1000 / 60 / 60 / 24
    var daysRound = Math.floor(days)
    var hours = my_time / 1000 / 60 / 60 - (24 * daysRound)
    var hoursRound = Math.floor(hours)
    var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound)
    var minutesRound = Math.floor(minutes)
    var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound)
    // console.log('转换时间:', daysRound + '天', hoursRound + '时', minutesRound + '分', seconds + '秒')
    var time = ''
    if (onlyhours) {
      time = hoursRound
    } else {
      time = hoursRound + ':' + minutesRound + ':' + seconds
    }
    return time
  }
  
  // 判断是否是微信浏览器的函数
  function isWeiXin () {
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase()
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      return true
    } else {
      return false
    }
  }
  

  //记录用户访问的页面
  function recordUserVisit(){
    //var url = "";
    $.get('/myInterFace/UserVisitCount.ashx?flag=add');
  }

  
  //页面跳转动画
  ( function (){
    //这里忽略jQuery所有实现
    $('#alink').bind('click',function(){
      $(".load-container").show();
    });
})();