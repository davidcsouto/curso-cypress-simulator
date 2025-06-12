describe('Pesquisar produto no marketplace da Amazon', () => {
    it('Pesquisar por produto na Amazon', () => {
        cy.visit('https://www.amazon.com.br')
        cy.get('.nav-search-field  input[type=text]').type("fralda")
        cy.get('input[type=submit]').click()

        cy.contains('h2', 'Resultado')
            .should('be.visible')
    })
})