
//从URL中回去相应参数值
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = (window.location.search+'').substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(r[2]); return null;
}
//封装ajax方法，
function post_async(url, param, callback, errorCallback, dataType, timeout) { $.ajax({ url: url, type: "POST", data: param, ContentType: dataType || "application/json", dataType: "json", timeout: timeout || 15000, success: function (e) { if (callback && typeof callback == "function") { callback(e) } }, error: function (err) { console.log(err); if (errorCallback && typeof errorCallback == "function") { errorCallback() } } }) }

function get_async(url, callback, errorCallback, dataType, timeout) { $.ajax({ url: url, type: "GET", ContentType: dataType || "application/json", timeout: timeout || 15000, success: function (e) { $(".body-loading").hide(); if (callback && typeof callback == "function") { callback(e) } }, error: function (err) { console.log(err); if (errorCallback && typeof errorCallback == "function") { errorCallback() } } }) }

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

