const Webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  entry: {
    app: path.join(__dirname, 'public/js/app.jsx')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public/dist')
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style', use: 'css' })
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new Webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new AssetsPlugin()
  ]
};
