describe('Users - List Users', () => {

    it.only('Should list all users', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include.all.keys('quantidade', 'usuarios')
        })
    })
}) 