Cypress.Commands.add("login", () => {
    const setup = () => {
        cy.visit("./src/index.html?skipCaptcha=true")
        cy.contains('button', 'Login').click()
    }

    const validate = () => {
        cy.visit("./src/index.html")
        cy.contains("button", "Login", {timeout: 1000})
            .should("not.be.visible")
    }

    const options = {
        cacheAcrossSpecs: true, // allows other specs use a session already create in other spec
        validate
    }

    cy.session(
        "sessionId",
        setup,
        options
    )
})

Cypress.Commands.add("run", cmd => {
    cy.get("#codeInput")
      .type(cmd)
    cy.get("#runButton").click()
})