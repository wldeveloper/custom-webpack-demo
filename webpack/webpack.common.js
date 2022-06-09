const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const { getAbsPath } = require('./utils');

const isProd = process.env.NODE_ENV === 'production';
const styleHandle = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

const css = {
  loader: 'css-loader',
  options: {
    sourceMap: !isProd,
  },
};

const cssWithModules = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: !isProd ? '[path][name]-[local]' : '[hash:base64]',
    },
    sourceMap: !isProd,
  },
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    sourceMap: !isProd,
    postcssOptions: {
      plugins: [
        [
          'postcss-preset-env',
          {
            autoprefixer: {
              remove: false,
            }
          },
        ],
      ]
    }
  },
};

const scss = {
  loader: 'sass-loader',
  options: {
    sourceMap: !isProd,
  },
};

const scssWithModulesLoader = [
  styleHandle,
  cssWithModules,
  postcss,
  scss,
];

const scssLoader = [
  styleHandle,
  css,
  postcss,
  scss,
];

const cssLoader = [
  styleHandle,
  css,
  postcss,
];

const cssWithModulesLoader = [
  styleHandle,
  css,
  postcss,
];

const commonConfig = {
  // target: ['web', 'es5'],
  target: ['browserslist'],
  entry: getAbsPath('./src/index.js'),
  output: {
    path: getAbsPath('./dist'),
    assetModuleFilename: 'media/[hash:10][ext][query]',
    globalObject: 'this',
    clean: true, // 构建前清理输出所在文件夹
    pathinfo: false, // 输出结果不携带路径信息，提升构建性能
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [!isProd && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
        sideEffects: false, // ES6模块 无副作用 可用于treeShaking（前提是ES6静态模块）
      },
      {
        test: /\.ts(x)?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [!isProd && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: true, // 关闭类型检查，缩短构建时间。如要使用类型检查，请使用 ForkTsCheckerWebpackPlugin。使用此插件会将检查过程移至单独的进程，可以加快 TypeScript 的类型检查和 ESLint 插入的速度
            },
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: cssLoader,
        exclude: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: cssWithModulesLoader,
        include: /\.module\.css$/
      },
      {
        test: /\.s[ca]ss$/,
        use: scssLoader,
        exclude: /\.module\.s[ca]ss$/
      },
      {
        test: /\.s[ca]ss$/,
        use: scssWithModulesLoader,
        include: /\.module\.s[ca]ss$/
      },
      {
        test: /\.(png|jpe?g|gif|mp3|mp4|eot|woff|ttf)$/,
        type: !isProd ? 'asset/inline' : 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
    ]
  },
  resolve: {
    alias: {
      config$: 'src/config/config.js',
      utils$: 'src/utils/utils.js',
      cps: 'src/components',
    },
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.css',
      '.scss',
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: getAbsPath('index.html'),
    }),
    new webpack.DefinePlugin({ // 源码内全局变量
      _isProd: JSON.stringify(isProd), // 生产模式
    }),
    new webpack.ProvidePlugin({ // 预置依赖--通过全局变量取模块
      Svg: ['react-svg-inline', 'default'],
      React: 'react',
      Fragment: ['react', 'Fragment'],
    }),
  ],
};

module.exports = {
  isProd,
  commonConfig,
};
