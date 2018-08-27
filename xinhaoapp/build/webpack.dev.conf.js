var utils = require('./utils')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// var bundleConfig = require("../dist/static/js/bundle-config.json")


// add hot-reload related code to entry chunks

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true,
    // libJsName:bundleConfig.libs.js, 
    //   libCssName:bundleConfig.libs.css,
    //   env:config.dev.env,
    minify: {
        removeComments: true, //去注释
        collapseWhitespace: true, //压缩空格
        removeAttributeQuotes: true //去除属性引用

        },
        chunksSortMode: 'dependency'
    }),
    new FriendlyErrorsPlugin()
  ]
 //    var devClient = 'webpack-hot-middleware/client';
 //    Object.keys(config.entry).forEach(function (name, i) {
 //    var extras = [devClient]
 //    config.entry[name] = extras.concat(config.entry[name])
 // })
})
