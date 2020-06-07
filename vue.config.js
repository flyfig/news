/*
 * @Author: your name
 * @Date: 2020-05-27 09:01:09
 * @LastEditTime: 2020-06-01 10:53:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue\vue.config.js
 */
const path = require('path')
const moment = require('moment');
process.env.VUE_APP_TIME = moment().format('YYYY.MM.DD hh:mm:ss');

module.exports = {
  publicPath: '/', // vueConf.baseUrl, // 根域上下文目录
  // outputDir: 'dist', // 构建输出目录
  assetsDir: 'wapAssets', // 静态资源目录 (js, css, img, fonts)
  indexPath:'./www/index.html',
  lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  // runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: {
    // 配置高于chainWebpack中关于css loader的配置
    // modules: true, // 是否开启支持‘foo.module.css’样式
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    // sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    loaderOptions: { // css预设器配置项
      // less: {
      //   loaderOptions: {
      //   data: `@import "@/assets/less/global.less";`
      //   }
      // }
    }
  },
  parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/global.less')]
    }
  },
  pwa: {
    // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8081,
    https: false,
    hotOnly: true,
    // proxy: null
    proxy: {
      '^/myInterFace': {
        target: 'http://supwk.nat300.top', //代理配置
        ws: true,
        changeOrigin: true,
        secure:false
      }
    }
    // before: app => {}
  },
  chainWebpack: config => {
    config.plugin('html')
        .tap(args => {
            if(process.env.NODE_ENV === 'production') {
                args[0].minify.removeComments = false;
            }
            return args;
        });
}
}
