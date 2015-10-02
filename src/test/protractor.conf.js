'use strict'
require('babel-core/register')
//require('source-map-support').install()

exports.config = {
  framework: 'jasmine2',
  multiCapabilities: [{
    browserName: 'chrome'
  }
  //  , { browserName: 'internet explorer'} // See https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver
  ],
  troubleshoot: true,
  rootElement: 'html',
  baseUrl: 'http://localhost:3000',
  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['e2e/**/*.spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
}
