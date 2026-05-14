describe('Products - List Registered Products', () => {

    const defaultId = 'BeeJh5lz3k6kSIzA';

    it('TC001 - List all products without filter', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return typeof body.quantidade === 'number' && Array.isArray(body.produtos)
            })
        })
    })

    it.only('TC002 - List all products by existent ID', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/produtos?_id=${defaultId}`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quantidade', 'produtos').and.to.satisfy((body) => {
                return body.quantidade === 1 && body.produtos.length === 1 && body.produtos[0]._id === defaultId
            })
        })
    })
})