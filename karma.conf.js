module.exports = function(config) {
  config.set({

    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],

    basePath: './',

    files: [
      './test/*.js',
    ],

    preprocessors: {
      './test/index.js': ['webpack'],
    },

    webpack: require('./webpack.config'),

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      require("karma-webpack"),
    ]
  });
};