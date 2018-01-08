const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const winston = require('winston');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackConfig = require('./webpack.config.js');

module.exports = () => {
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins = [
    new ExtractTextPlugin('[name].css')
  ];
  webpackConfig.output.filename = '[name].js';

  const compiler = webpack(webpackConfig);
  let bundleStart = null;

  compiler.plugin('compile', () => {
    winston.loggers.get('init').info('Compiling assets...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    winston.loggers.get('init').info('Bundled in', Date.now() - bundleStart, 'ms!');
  });

  const bundler = new WebpackDevServer(compiler, {
    publicPath: '/dist/',
    hot: true,
    quiet: true,
    noInfo: true,
    stats: {
      colors: true
    }
  });

  bundler.listen(3001, 'localhost', () => {
    winston.loggers.get('init').info('Bundling project, please wait...');
  });
};
