describe("Cypress Simulator - A11y Checks", () => {
    beforeEach(() => {
        cy.login()
        cy.visit('./src/index.html?skipCaptcha=true&chancesOfError=0', {
            onBeforeLoad(win){
                win.localStorage.setItem("cookieConsent", "accepted")
            }
        })
        cy.injectAxe()
    })

  it("successfully simulates a Cypress command (e.g., cy.log('Yay!')", () => {
    cy.run("cy.log('Yay!')")

    cy.get("#outputArea")
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')

    cy.checkA11y(".success")
  })

  it("shows an error when entering and running an invalid Cypress command (e.g., cy.run()", () => {
    cy.run("cy.run()")

    cy.get("#outputArea")
      .should("contain", "Error")
      .and("contain", "Invalid Cypress command: cy.run()")
      .and('be.visible')

    cy.checkA11y(".error")
  })

  it("shows a warning when entering and running a not-implemented Cypress command (e.g., cy.contains('Login')", () => {
    cy.run("cy.contains('Login')")

    cy.get("#outputArea")
      .should("contain", "Warning")
      .and("contain", "The `cy.contains` command has not been implemented yet.")
      .and('be.visible')

    cy.checkA11y(".warning")
  })

  it("asks for help and gets common Cypress commands and examples with a link to the docs", () => {
    cy.run("help")

    cy.get("#outputArea")
      .should("contain", "Common Cypress commands and examples:")
      .and("contain", "For more commands and details, visit the official Cypress API documentation.")
      .and('be.visible') 
    
    cy.contains('#outputArea a', 'official Cypress API documentation')
      .should('have.attr', 'href', 'https://docs.cypress.io/api/table-of-contents')
      .and('have.attr', 'target', '_blank')
      .and('be.visible')

    cy.checkA11y("#outputArea")
  })

  it("maximizes and minimizes a simulation result", () => {
    cy.run("cy.log('Yay!')")
 
    cy.get("#outputArea")
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')
    cy.get('.expand-collapse').click()
    cy.get('#collapseIcon').should('be.visible')

    cy.checkA11y()
    
    cy.get('.expand-collapse').click()
    cy.get('#expandIcon').should('be.visible')

  })

  it("logs out successfully", () => {
    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').click()

    cy.contains('button', 'Login').should('be.visible')
    cy.get('#sandwich-menu').should('not.be.visible')

    cy.checkA11y()
  })

  it("show and hide logout button", () => {
    cy.get('#logoutButton').should('not.be.visible')
    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('be.visible')

    cy.checkA11y()

    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('not.be.visible')    
  })

  it("shows the running state before showing the final result", () => {
    cy.run("cy.log('Yay!')")

    cy.get("#runButton")
      .should('contain', 'Running...')
    cy.contains('#outputArea', 'Running... Please wait.')
      .should('be.visible')

      cy.checkA11y()

    cy.contains('button', 'Running...').should('not.exist')
    cy.contains('button', 'Run').should('be.visible')

    cy.contains('#outputArea', 'Running... Please wait.')
      .should('not.exist')
    cy.get('#outputArea')
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')
  })

})

describe('Cypress Simulator - Cookies consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true')
    cy.injectAxe()
  })

  it("consents on the cookies usage", () => {
    cy.get('#cookieConsent')
      .as('cookieConsentBanner')
      .should('be.visible')

    cy.checkA11y()
    cy.get('@cookieConsentBanner')
      .find("button:contains('Accept')")
      .click()

    cy.get('@cookieConsentBanner').should('not.be.visible')
    cy.window()
      .its('localStorage.cookieConsent')
      .should('be.equal', "accepted")
  })
})

describe('Cypress Simulator - Captcha', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
    cy.contains('button', 'Login').click()
    cy.injectAxe()
  })

  it("finds no a11y issues on all captcha view states (button enabled/disabled and error)", () => {
    cy.get('#verifyCaptcha').as('buttonVerify')
        .should('be.disabled')

    cy.get('#captchaInput').as('captchaInput')
      .type('200')
    cy.get('@buttonVerify').should('be.enabled')

    cy.checkA11y()

    cy.get('#verifyCaptcha').as('buttonVerify').click()
    cy.get('#captchaError')
      .should('be.visible')
      .and('have.text', 'Incorrect answer, please try again.')

    cy.get('@captchaInput').should('have.value', '')
    cy.get('@buttonVerify').should('be.disabled')

    cy.checkA11y()
  })
})