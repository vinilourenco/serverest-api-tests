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
        cy.editUser(`${userId}`, randomName, randomEmail, 'novasenha123', 'false').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
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

    it('OK - Should update user keeping the same email', () => {
        cy.editUser(`${defaultId}`, 'Nome Modificado', 'fulano@qa.com', 'novasenha123', 'true').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
    })

    it('OK - Should update administrador value succesfully', () => {
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'false').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message').includes('Registro alterado com sucesso')
        })
    })
})