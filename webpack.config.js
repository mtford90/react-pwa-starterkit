const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    //new OfflinePlugin({ excludes: ['images/*.png'] }),
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: `${__dirname}/src`,
        exclude: /bundle\.js$/,
      },
    ],
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'src'),
      query: {
        presets: [
          'es2015',
          'stage-1',
          'react',
        ],
        plugins: [
          'react-hot-loader/babel',
        ],
      },
    },
    {
      test: /\.css/,
      loaders: ['style', 'css'],
    }],
  },
};
