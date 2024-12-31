const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: '/public/index.html',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});