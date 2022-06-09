const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const { commonConfig } = require('./webpack.common');

const config = {
  mode: 'production',
  bail: true,
  output: {
    publicPath: '/', // 本地开发和打包时会动态替换
    filename: 'js/[name].[contenthash:10].js',
    chunkFilename: 'js/[contenthash:10].js', // import()导入的模块
  },
  /* externals: { // 可将下面所列库作为外部依赖，从生成的bundle中剔除出去
    '@ant-design/icons/lib/dist': 'AntDesignIcons',
    antd: 'antd',
    'antd-mobile': `window['antd-mobile']`,
    axios: 'axios',
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    'react-custom-scrollbars': 'ReactCustomScrollbars',
  }, */
  optimization: {
    runtimeChunk: 'single', // 当单个HTML页面有多个入口时，添加该配置（开发环境也需要），否则可能会产生问题，作用是将webpack runtime代码提取到单独bundle
    moduleIds: 'deterministic', // 保证第三方vendor bundle未改变时多次打包的hash一致
    splitChunks: {
      cacheGroups: { // default 选项是抽取重复用到的模块
        vendor: { // 提取node_modules下第三方模块
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
  plugins: [
    // 作用域提升, 可能可以使打包后的体积更小
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:10].css`,
      chunkFilename: `css/[contenthash:10].css`,
    }),
  ],
};

module.exports = (env, argv) => {
  return merge(commonConfig, config, {
    devtool: env.pre ? 'inline-source-map' : 'hidden-source-map', // 区别生产和预发布
    plugins: [env.analyze && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })].filter(Boolean),
  });
};
