<!--
 * @Author: your name
 * @Date: 2020-01-13 11:45:26
 * @LastEditTime: 2020-01-15 15:19:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \user\README.md
 -->
# gqtinit

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 目录结构
```
│  App.vue
│  main.js
│
├─api
│  index.js 接口列表
│
├─assets
│  ├─font 字体图标
│  ├─img
│  └─less
│          global.css
│          global.less 全局样式
│
├─components
│      Coupon.vue 通用优惠券组件
│      Thead.vue 通用头部
│      Ttitle.vue 通用标题
│
├─router
│    index.js 路由
│
├─store 仓库
├─svg
│
├─utils
│      request.js 封装axios
│      storage.js 缓存封装
│      tools.js 一些工具
│      validata.js 验证
│
└─views
    │  Layout.vue
    │
    ├─merchant
    │      coupon.vue
    │      index.vue
    │      shop.vue
    │
    ├─pages
    │      account.vue
    │      addAddress.vue
    │      address.vue
    │      branch.vue
    │      content.vue
    │      join.vue
    │      location.vue
    │      order_detail.vue
    │      question.vue
    │      search.vue
    │      seluser.vue
    │      shopdetail.vue
    │      shop_sort.vue
    │      submit.vue
    │      test.vue
    │      user_code.vue
    │      user_coupon.vue
    │      user_edit.vue
    │      user_order.vue
    │      user_star.vue
    │
    └─tabs
            Coupon.vue
            Home.vue
            Merchant.vue
            Mine.vue
            Shop.vue
```
