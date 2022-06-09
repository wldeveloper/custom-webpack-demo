const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { commonConfig } = require('./webpack.common');
const { getAbsPath } = require('./utils');

const config = {
  mode: 'development',
  devtool: 'eval-source-map', // 开发环境可用的最佳品质source-map，但速度较慢
  output: {
    publicPath: '/', // 本地开发和打包时会动态替换
    filename: 'app.js',
    chunkFilename: '[id].js', // import()导入的模块
  },
  devServer: { // webpack-der-server 在内存中访问资源地址 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]
    /* static: {
      directory: getAbsPath('./dist'), // 告诉服务器从哪里提供内容。只有在你希望提供静态文件时才需要这样做
      // publicPath: '/', // 告诉服务器在哪个URL上提供 static.directory 的内容，开发时候优先级最高
    }, */
    open: true, // 打开默认浏览器
    // historyApiFallback: { // 兼容单页应用HTML5 History API
    //   rewrites: [{ from: /.*/, to: '/index.html' }]
    // },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // },
  },
  plugins: [
    // react webpack 热更新
    new ReactRefreshWebpackPlugin(),
    // 跳过编译时出错的代码
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = (env, argv) => {
  return merge(commonConfig, config);
};
