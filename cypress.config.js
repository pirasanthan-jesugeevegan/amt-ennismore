const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.amazon.co.uk/',
    specPattern: '**/*.feature',
    video: false,
    videoUploadOnPasses: false,
    retries: 1,
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 40000,
    pageLoadTimeout: 40000,
    responseTimeout: 40000,
    multiple: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    restartBrowserBetweenSpecFiles: true,
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      on('after:run', (results) => {
        if (results) {
          fs.mkdirSync('cypress/.run', { recursive: true });
          fs.writeFile('cypress/.run/results.json', JSON.stringify(results));
        }
      });
    },
  },
});
