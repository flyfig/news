/**
 * 验证.
 */
import { Toast } from 'vant'
import { merge } from './tools.js'

// 验证机制
const verifiReg = {
  /* 整点数字 */
  validataIsNumber: function (str) {
    const isNumber = /^\d+(\.\d+)?$/
    return isNumber.test(str)
  },
  /* 身份证号 */
  validataIdCard: function (str) {
    const idcardreg = /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/
    return idcardreg.test(str)
  },
  /* 中文姓名 */
  validataRCnName: function (str) {
    const realnamereg = /^[\u4e00-\u9fa5]{2,}$/
    return realnamereg.test(str)
  },
  /* 合法手机号 */
  validataPhone: function (str) {
    const mobilereg = /^1[3-9]\d{9}$/
    return mobilereg.test(str)
  },
  /* 合法邮箱 */
  validataEmail: function (str) {
    const emailreg = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    return emailreg.test(str)
  },
  /* 合法用户名 */
  validataUsername: function (str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
  },
  /* 合法uri */
  validataURL: function (str) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(str)
  },
  /* 合法域名 */
  validataDomain: function (str) {
    const domainregex = /^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return domainregex.test(str)
  },
  /* 小写字母 */
  validataLowerCase: function (str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
  },
  /* 大写字母 */
  validataUpperCase: function (str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
  },
  /* 大小写字母 */
  validataAlphabets: function (str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
  },
  validataPassword: function (str) {
    const reg = /^(?=.*\d)[\da-zA-Z~!@#$%^&*]{6,12}$/
    return reg.test(str)
  }
}

// 验证options默认值
const defaults = {
  name: '',
  data: '',
  reg: '',
  tipsTxt: '您的输入值无效',
  allowNull: false,
  filter: false
}

// 验证调用入口
const validata = function (options) {
  return new Promise(function (resolve, reject) {
    if (typeof options !== 'object') {
      if (reject) reject('error')
    }
    for (let i = 0; i < options.length; i++) {
      var option = merge({}, defaults, options[i])
      if (!option.filter) {
        if (!option.allowNull && option.data) {
          if (option.data.length === 0 || option.data === '' || option.data === null) {
            // Notify({ type: 'danger', message: option.name + '不能为空！' })
            Toast(option.name + '不能为空！')
            return resolve(false, option.name, 'null')
          }
        }
        if (!option.allowNull && !option.data) {
          // Message.error({ message: option.name + '不能为空！', showClose: true })
          // Notify({ type: 'danger', message: option.name + '不能为空！' })
          Toast(option.name + '不能为空！')
          return resolve(false, option.name, 'null')
        }
        if (option.reg) {
          var regAdopt = verifiReg[option.reg](option.data)
          if (!regAdopt) {
            if (option.tipsTxt) Toast(option.tipsTxt)
            return resolve(false, option.name, 'invalid')
          }
        }
      }
    }
    return resolve(true)
  })
}

export default validata
