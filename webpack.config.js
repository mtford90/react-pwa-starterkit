const path    = require('path');
const webpack = require('webpack');

import loaders from './webpack/loaders.config'
import plugins from './webpack/plugins.config'

module.exports = {
  devtool: null,
  entry:   [

    'webpack-hot-middleware/client',
    'babel-polyfill',
    './src/index',
  ],
  output:  {
    path:       path.join(__dirname, 'dist'),
    filename:   'bundle.js',
    publicPath: '/dist',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    ...plugins
  ],
  module:  {
    loaders: loaders,
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
  },
  stats:   {
    colors: true,
    chunks: false,
    cached: false,
  }
};
