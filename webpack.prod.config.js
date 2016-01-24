var webpack = require('webpack');
var path = require('path');

module.exports = {
  target: 'web',
  cache: 'false',
  entry: './index',
  resolve: {
    root: __dirname,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', './'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    pathInfo: true,
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015,presets[]=stage-2'],
      },
    ],
  },
  debug: false,
};