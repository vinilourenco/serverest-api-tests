const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'o9wasp',
  viewportHeight: 880,
  viewportWidth: 1280,
  e2e: {
    baseUrl: 'https://serverest.dev'
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true
  }
});
