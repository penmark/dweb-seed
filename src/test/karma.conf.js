module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine', 'browserify'],
    preprocessors: {
      'app/**/*.js': ['browserify', 'coverage']
    },
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],

    autoWatch: true,

    browserify: {
      debug: true,
      transform: [
        'babelify'
        //*, istanbul({
        //  instrumenter: isparta,
        //  ignore: ['**/node_modules/**', '**/test/**']
        //})
      ]
    },

    proxies: {
      '/': 'http://localhost:9876/'
    },

    urlRoot: '/__karma__/',

    files: [
      // app-specific code
      'app/index.js',

      // 3rd-party resources
      '../node_modules/angular-mocks/angular-mocks.js',

      // test files
      'app/**/*.spec.js'
    ],

    coverageReporter: {
      dir: '../.tmp/coverage'
    }
  })
}
