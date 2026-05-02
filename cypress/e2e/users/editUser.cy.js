const Chance = require('chance');

describe('Users - Edit User', () => {

    const chance = new Chance()
    const defaultId = '0uxuPY0cbmQhpEz1'
    let randomName
    let randomEmail
    let userId

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()

        cy.registerUser(randomName, randomEmail).then((response) => {
            userId = response.body._id
            cy.log('Usuário criado com ID: ', userId);
            
        })
    })

    afterEach(() => {
        if (userId) {
            cy.request({
                method: 'DELETE', 
                url: `${Cypress.config('baseUrl')}/usuarios/${userId}`,
                failOnStatusCode: false
            })
        }
    })

    it('OK - Should return status code 200 when updating an existent user', () => {
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${userId}`,
            body: {
                nome: 'Nome Atualizado',
                email: randomEmail,
                password: 'novasenha123',
                administrador: 'false'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    })
})