const Chance = require('chance');

describe('Users - Edit User', () => {

    const chance = new Chance()
    const defaultId = '0uxuPY0cbmQhpEz1'
    const defaultId2 = '0uxuPY0cbmQhpEz2'
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
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
    })

    it('OK - Should return status code 201 and create a new user when updating unknown valid ID', () => {
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId2}`,
            body: {
                nome: 'Novo Usuário',
                email: 'newuser@qa.com',
                password: 'novasenha123',
                administrador: 'true'
            }
        }).then((response) => {
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

    it.only('OK - Should update user keeping the same email', () => {
        cy.editUser(`${defaultId}`, 'Nome Modificado', 'fulano@qa.com', 'novasenha123', 'true').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
    })
})