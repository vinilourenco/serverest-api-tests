describe('Products - List Registered Products', () => {

    it.only('OK - List all products without filter', () => {
        cy.request({
            method: 'GET',
            url: `${Cypess.config('baseUrl')}/produtos`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quatidade', 'produtos').and.to.satisfy((body) => {
                return typeof body.quantidade === 'number' && Array.isArray(body.produtos)
            })
        })
    })
})