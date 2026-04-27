describe('Users - Get Users', () => {

    const defaultId = '0uxuPY0cbmQhpEz1';

    it('OK - Verify that the user is found with a valid ID.', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('_id').includes(`${defaultId}`)
        })
    })
})