// 全局小工具js
// import store from '@/store'
// import MessageBox from '@/components/Layout/Popup/message-box/'

/**
 * 跳转路由或http链接
 * @param { String } route 路由值或http链接字符串
 */
import router from '@/router'

export function RouterLink (route) {
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

export function screenAdaptation () {
  const clientW = document.body.clientWidth
  const scale = 750 / 100 // 当屏幕 = 640px时，html根字体 = 100px
  document.getElementsByTagName('html')[0].style.fontSize = `${clientW / scale}px`
}

export function merge (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }
  return target
}

export function formatDateTime (date, showTime) {
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

export function getDuration (my_time, onlyhours) {
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
export function isWeiXin () {
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true
  } else {
    return false
  }
}
