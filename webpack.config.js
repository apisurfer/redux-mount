var webpack = require('webpack');
var path = require('path');

module.exports = {
  target: 'web',
  cache: 'false',
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015,presets[]=stage-2'],
      },
    ],
  },
  debug: true,
};