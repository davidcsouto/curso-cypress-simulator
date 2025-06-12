describe("Cypress Simulator", () => {
  beforeEach(() =>{
    cy.login()
    cy.visit("./src/index.html?skipCaptcha=true&chancesOfError=0", {
      onBeforeLoad: (contentWindow) => {
        contentWindow.localStorage.setItem("cookieConsent", "accepted")
      }
    })
  })

  it("successfully simulates a Cypress command (e.g., cy.log('Yay!')", () => {
    cy.run("cy.log('Yay!')")

    cy.get("#outputArea")
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')
  })

  it("shows an error when entering and running an invalid Cypress command (e.g., cy.run()", () => {
    cy.run("cy.run()")

    cy.get("#outputArea")
      .should("contain", "Error")
      .and("contain", "Invalid Cypress command: cy.run()")
      .and('be.visible')
  })

  it("shows a warning when entering and running a not-implemented Cypress command (e.g., cy.contains('Login')", () => {
    cy.run("cy.contains('Login')")

    cy.get("#outputArea")
      .should("contain", "Warning")
      .and("contain", "The `cy.contains` command has not been implemented yet.")
      .and('be.visible')
  })

  it("shows an error when entering and running a valid Cypress command without parentheses (e.g., cy.visit)", () => {
    cy.run("cy.visit")

    cy.get("#outputArea")
      .should("contain", "Error")
      .and("contain", "Missing parentheses on `cy.visit` command")
      .and('be.visible')
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
  })

  it("maximizes and minimizes a simulation result", () => {
    cy.run("cy.log('Yay!')")

    cy.get("#outputArea")
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')

    cy.get('.expand-collapse').click()

    cy.get('#collapseIcon').should('be.visible')
    
    cy.get('.expand-collapse').click()
    cy.get('#expandIcon').should('be.visible')

  })

  it("logs out successfully", () => {
    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').click()
    cy.contains('h2', "Let's get started!")
    cy.contains('button', 'Login').should('be.visible')
    cy.get('#sandwich-menu').should('not.be.visible')
  })

  it("show and hide logout button", () => {
    cy.get('#logoutButton').should('not.be.visible')
    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('be.visible')
    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('not.be.visible')    
  })

  it("shows the running state before showing the final result", () => {
    cy.run("cy.log('Yay!')")
    cy.get("#runButton")
      .should('contain', 'Running...')
      
    cy.contains('#outputArea', 'Running... Please wait.')
      .should('be.visible')

    cy.contains('button', 'Running...').should('not.exist')
    cy.contains('button', 'Run').should('be.visible')

    cy.contains('#outputArea', 'Running... Please wait.')
      .should('not.exist')
    cy.get('#outputArea')
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')
  })
  
  it("checks the run button disabled and enabled states", () => {
    cy.get("#runButton")
      .should('be.disabled')

    cy.get("#codeInput").as('codeInput')
      .type("cy.log('Yay!')")
      .should("have.value", "cy.log('Yay!')")

    cy.get("#runButton")
      .should('be.enabled')

    cy.get('@codeInput').clear()

    cy.get("#runButton")
      .should('be.disabled')
  })

  it("clears the code input when logging off then logging in again", () => {
    cy.get("#codeInput").as('codeInput')
      .type("cy.log('Yay!')")
      .should("have.value", "cy.log('Yay!')")

    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('be.visible').click()

    cy.contains("Login")
      .click()
    cy.get('@codeInput').should('have.value', "")
  })

  it('disables the run button when logging off then logging in again', () => {
    cy.get("#codeInput").as('codeInput')
      .type("cy.log('Yay!')")

    cy.get("#runButton")
      .should('be.enabled')

    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('be.visible').click()

    cy.contains("Login").click()
    cy.get("#runButton")
      .should('be.disabled')
  })

  it("clears the code output when logging off then logging in again", () => {
    cy.get("#codeInput").as('codeInput')
      .type("cy.log('Yay!')")
      .should("have.value", "cy.log('Yay!')")

    cy.get("#runButton")
      .click()

    cy.get("#outputArea")
      .should("contain", "Success")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and('be.visible')

    cy.get('#sandwich-menu').click()
    cy.get('#logoutButton').should('be.visible').click()
    cy.contains("Login")
      .click()
    
    cy.get("#outputArea").should('not.contain', "cy.log('Yay!')")
  })

  it("doesn't show the cookie consent banner on the login page", () => {
    cy.clearAllLocalStorage()
    cy.reload()

    cy.contains('button', 'Login').should('be.visible')
    cy.get('#cookieConsent').should('not.be.visible')
  })
})

describe('Cypress Simulator - Cookies consent', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('./src/index.html?skipCaptcha=true')
  })

  it("consents on the cookies usage", () => {
    cy.get('#cookieConsent')
      .as('cookieConsentBanner')
      .find("button:contains('Accept')")
      .click()

    cy.get('@cookieConsentBanner').should('not.be.visible')
    cy.window()
      .its('localStorage.cookieConsent')
      .should('be.equal', "accepted")
  })
  
  it("declines on the cookies usage", () => {
    cy.get('#cookieConsent')
      .as('cookieConsentBanner')
      .find("button:contains('Decline')")
      .click()

    cy.get('@cookieConsentBanner').should('not.be.visible')
    cy.window()
      .its('localStorage.cookieConsent')
      .should('be.equal', "declined")
  })
})

describe('Cypress Simulator - Captcha', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
    cy.contains('button', 'Login').click()
  })

  it("disables the captcha verify button when no answer is provided or it's cleared", () => {
    cy.get('#verifyCaptcha').as('buttonVerify')
    .should('be.disabled')

    cy.get('#captchaInput').as('captchaInput')
      .type('2')

    cy.get('@buttonVerify').should('be.enabled')
    cy.get('@captchaInput').clear()
    cy.get('@buttonVerify').should('be.disabled')
  })

  it("shows an error on a wrong captcha answer and goes back to its initial state", () => {
    cy.get('#captchaInput').as('captchaInput')
      .type('200')
      .should('be.enabled')

    cy.get('#verifyCaptcha').as('buttonVerify').click()
    cy.get('#captchaError')
      .should('be.visible')
      .and('have.text', 'Incorrect answer, please try again.')

    cy.get('@buttonVerify').should('be.disabled')
  })
})