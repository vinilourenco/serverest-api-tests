describe('Users - List Users', () => {

    it('Should list all users', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('quantidade').to.equal(9)
        })
    })
})