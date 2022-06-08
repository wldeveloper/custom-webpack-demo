const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
  target: ['web', 'es5'],
  output: {
    path: getAbsPath('./dist'),
    assetModuleFilename: 'media/[hash:10][ext][query]',
    globalObject: 'this',
    clean: true, // 构建前清理输出所在文件夹
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        sideEffects: false, // ES6模块 无副作用 可用于treeShaking
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true
        },
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
      filename: getAbsPath('./public/index.html'),
    }),
    new webpack.DefinePlugin({ // 源码内全局变量
      _isProd: JSON.stringify(isProd), // 生产模式
    }),
    new webpack.ProvidePlugin({ // 源码内模块的便捷引用
      Svg: ['react-svg-inline', 'default'],
      React: 'react',
      Fragment: ['react', 'Fragment'],
    }),
  ],
  optimization: {
    runtimeChunk: 'single', // 当单个HTML页面有多个入口时，添加该配置，否则可能会产生问题，作用是将webpack runtime代码提取到单独bundle
  },
};

module.exports = {
  isProd,
  commonConfig,
};
