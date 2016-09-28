const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { verbose: false }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin([
      { from: 'images/', to: 'images/' },
      { from: 'manifest.json' }]),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'your-cachedId',
        filename: 'your-service-worker.js',
        runtimeCaching: [{
          handler: 'cacheFirst',
          urlPattern: /^(https:\/\/api\.github\.com\/users\/)/,
        },
        {
          handler: 'cacheFirst',
          urlPattern: /[.]jpg$/,
        }],
      }
    ),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      query: {
        presets: [
          'es2015',
          'stage-1',
          'react',
        ],
      },
    },
    {
      test: /\.css/,
      loaders: ['style', 'css'],
    }],
  },
};
