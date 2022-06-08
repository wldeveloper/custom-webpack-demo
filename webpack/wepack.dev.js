const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { commonConfig } = require('./webpack.common');
const { getAbsPath } = require('./utils');

const config = {
  mode: 'development',
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    getAbsPath('./src/index.js'),
  ],
  output: {
    publicPath: '/', // 本地开发和打包时会动态替换
    filename: 'app.js',
    chunkFilename: '[id].js', // import()导入的模块
  },
  devServer: { // webpack-der-server 在内存中访问资源地址 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]
    'static': {
      directory: getAbsPath('./dist'),
    },
    // open: true,
    // historyApiFallback: {
    //   rewrites: [{ from: /.*/, to: '/index.html' }]
    // },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // },
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};

module.exports = (env, argv) => {
  const devConfig = merge(commonConfig, config);
  const plugins = [
    // webpack热更新
    new webpack.HotModuleReplacementPlugin(),
    // 跳过编译时出错的代码
    new webpack.NoEmitOnErrorsPlugin(),
  ];
  devConfig.plugins.push.apply(null, plugins);
  return devConfig;
};
