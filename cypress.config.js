const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportHeight: 1024,
  viewportWidth: 1700,
  e2e: {
    fixturesFolder: false, // indicates to Cypress that folder fixture will be not used.
  },
  defaultCommandTimeout: 6000
})
