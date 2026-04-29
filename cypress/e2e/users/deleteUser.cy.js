describe('User - Delete User', () => {

    const nonExistentUser = '0uxuPY0cbmQhpEz2';

    it('OK - Should return status code 200 when deleting a non-existent user', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('baseUrl')}/usuarios/${nonExistentUser}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Nenhum registro excluído')
        })
    })
})