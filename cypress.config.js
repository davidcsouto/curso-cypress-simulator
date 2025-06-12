const { defineConfig } = require("cypress")
const cypressSplit = require("cypress-split")

module.exports = defineConfig({
  viewportHeight: 1024,
  viewportWidth: 1700,
  e2e: {
    fixturesFolder: false, // indicates to Cypress that folder fixture will be not used.
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      return config
    }
  },
  defaultCommandTimeout: 6000
})
