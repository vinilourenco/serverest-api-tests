describe('User - Delete User', () => {

    const defaultId = '0uxuPY0cbmQhpEz1';
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

    it('Bad Request - Should return erro when deleting user with registered cart', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.all.keys('message', 'idCarrinho').and.to.satisfy(body => {
                return body.message.includes('Não é permitido excluir usuário com carrinho cadastrado') 
                    && typeof body.idCarrinho === 'string' 
                    && body.idCarrinho.length > 0
            })
        })
    })
})