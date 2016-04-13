module.exports = function(config) {
  config.set({
    basePath: 'app/scripts',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      '../../node_modules/phantomjs-polyfill/bind-polyfill.js',
      '**/__tests__/*'
    ],
    preprocessors: {
      '**/__tests__/*': ['webpack']
    },
    webpack: require('./webpack.test.config.js'),
    webpackMiddleware: { noInfo: true },
    singleRun: process.env.TRAVIS_CI === 'true',
    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      exitOnResourceError: true,
    },
    reporters: ['nyan'],
  })
};
