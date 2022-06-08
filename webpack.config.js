const getProdConfig = require('./webpack/webpack.prod');
const getDevConfig = require('./webpack/webpack.dev');
const { isProd } = require('./webpack/webpack.common');

module.exports = (env, argv) => {
  if (isProd) return getProdConfig(env, argv);
  return getDevConfig(env, argv);
};
