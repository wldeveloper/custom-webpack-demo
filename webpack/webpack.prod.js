const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const { commonConfig } = require('./webpack.common');
const { getAbsPath } = require('./utils');

const config = {
  mode: 'production',
  bail: true,
  entry: getAbsPath('./src/index.js'),
  output: {
    publicPath: '//', // 本地开发和打包时会动态替换
    filename: 'js/[name].[chunkhash:10].js',
    chunkFilename: 'js/[chunkhash:10].js', // import()导入的模块
  },
  externals: { // 可将下面所列库作为外部依赖，从生成的bundle中剔除出去
    '@ant-design/icons/lib/dist': 'AntDesignIcons',
    antd: 'antd',
    'antd-mobile': `window['antd-mobile']`,
    axios: 'axios',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    'react-custom-scrollbars': 'ReactCustomScrollbars',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  /* optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              mergeLonghand: false, // 这个要置为false，因为会把 padding-bottom: 34px; padding-bottom: calc(env(safe-area-inset-bottom) + 34px); 这种兼容代码的兼容部分删除
              discardComments: { removeAll: true },
            },
          ],
        }
      }),
    ],
  }, */
};

module.exports = (env, argv) => {
  const prodConfig = merge(commonConfig, config, {
    devtool: env.pre ? 'inline-source-map' : 'hidden-source-map', // 区别生产和预发布
  });
  const plugins = [
    // 作用域提升, 可能可以使打包后的体积更小
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:10].css`,
      chunkFilename: `css/[contenthash:10].css`,
    }),
  ];
  if (env.analyse) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }));
  }
  prodConfig.plugins.push.apply(null, plugins);
  return prodConfig;
};
