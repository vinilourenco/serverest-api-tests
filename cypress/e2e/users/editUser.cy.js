const Chance = require('chance');

describe('Users - Edit User', () => {

    const chance = new Chance()
    const defaultId = '0uxuPY0cbmQhpEz1'
    const defaultId2 = '0uxuPY0cbmQhpEz2'
    const longName = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)
    let randomName
    let randomEmail
    let userId
    let newId

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
            cy.deleteUser(userId)
        }
    })

    it('OK - Should return status code 201 and create a new user when updating unknown valid ID', () => {
        cy.editUser(`${defaultId2}`, randomName, 'newuser@qa.com', 'novasenha123', 'true').then((response) => {
            newId = response.body._id
            expect(response.status).to.equal(201)
            expect(response.body).to.have.all.keys('message', '_id').and.to.satisfy(body => {
                return body.message.includes('Cadastro realizado com sucesso') 
                    && typeof body._id === 'string'
                    && body._id.length > 0
            })
            cy.deleteUser(newId)
        })
    })

    it('OK - Should return status code 200 when updating an existent user', () => {
        cy.editUser(`${userId}`, randomName, randomEmail, 'novasenha123', 'false').then((response) => cy.editUserAssertion(response))
    })

    it('OK - Should update user keeping the same email', () => {
        cy.editUser(`${defaultId}`, 'Nome Modificado', 'fulano@qa.com', 'novasenha123', 'true').then((response) => cy.editUserAssertion(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserAssertion(response))
    })

    it('OK - Should update administrador value succesfully', () => {
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'false').then((response) => cy.editUserAssertion(response))
    })

    it('OK - Should return 200 when using special characters for user editing', () => {
        cy.editUser(`${defaultId}`, "Fúlano d'Sílva Jüñíor", 'fulano.especial@qa.com', 'teste123', 'true').then((response) => cy.editUserAssertion(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserAssertion(response))
    })

    it.only('OK - Should return 200 when updating user with a long name', () => {
        cy.editUser(`${defaultId}`, longName, 'nome.longo@qa.com', 'teste', 'true').then((response) => cy.editUserAssertion(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserAssertion(response))
    })
})