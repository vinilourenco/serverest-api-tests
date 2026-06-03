const Chance = require('chance')

describe('User - Delete User', () => {

    const chance = new Chance()
    const defaultId = '0uxuPY0cbmQhpEz1';
    const nonExistentUser = '0uxuPY0cbmQhpEz2';
    let randomName;
    let randomEmail;
    let userId;

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()
    })

    it('OK - Should return status code 200 when deleting an user', () => {
        cy.registerUser(randomName, randomEmail)
            .then((response) => {
                expect(response.status).to.equal(201)
                userId = response.body._id
            })
        cy.then(() => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.config('baseUrl')}/usuarios/${userId}`
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    })

    it('OK - Should return status code 200 when deleting a non-existent user', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('baseUrl')}/usuarios/${nonExistentUser}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Nenhum registro excluído')
        })
    })

    it.only('Bad Request - Should return erro when deleting user with registered cart', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.be.a('string').includes('Não é permitido excluir usuário com carrinho cadastrado')
            expect(response.body.idCarrinho).to.be.a('string').and.have.length.greaterThan(0)
        })
    })
})