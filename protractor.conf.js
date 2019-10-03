// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const failFast = require('protractor-fail-fast');

const { SpecReporter } = require('jasmine-spec-reporter');
var path = require('path');
//const { JunitReports } = require('jasmine-junit-reports');

var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var screenshotReporter = new HtmlScreenshotReporter({
  dest: 'testresults/screenshots',
  filename: 'testReport.html'
});

exports.config = {
  seleniumAddress: 'http://localhost:9444/wd/hub',
  allScriptsTimeout: 11000,
  specs: [
    './apps/e2e/arbitration/*.e2e-spec.ts',

  ],
  suites: {
    full: './apps/e2e/arbitration/*.e2e-spec.ts'
  },
  capabilities: {
    browserName: 'chrome',
    // https://github.com/karma-runner/karma-chrome-launcher/issues/73
    chromeOptions: {
      args: ['--no-sandbox']
    }
  },
  directConnect: true,
 // baseUrl: 'http://localhost:8080/',
  baseUrl: 'http://localhost:4200/',
  SELENIUM_PROMISE_MANAGER: false,
  useAllAngular2AppRoots: true,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () { }
  },
  beforeLaunch: function () {
    require('ts-node').register({
      project: './apps/e2e/tsconfig.e2e.json'
    });
    return new Promise(function(resolve){
      screenshotReporter.beforeLaunch(resolve);
    });
  },
  framework: 'jasmine2',
  onPrepare: function () {
    //browser.baseUrl = 'http://localhost:8080/';
    browser.baseUrl = 'http://localhost:4200/';
    var width = 1920;
    var height = 1080;
    browser.driver.manage().window().setSize(width, height);

    const params = require(`./apps/e2e/configurations/e2e-config.sample.json`);
    Object.assign(browser.params, params);

    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: false,
      savePath: 'testResults',
      filePrefix: 'test-results.xml'
    }));
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));


    jasmine.getEnv().addReporter(screenshotReporter);
  },

  plugins: [
    failFast.init(),
  ],

  afterLaunch: function(exitCode) {
    failFast.clean(); // Removes the fail file once all test runners have completed.
    return new Promise(function(resolve){
      screenshotReporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};

