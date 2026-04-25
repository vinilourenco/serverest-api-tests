const Chance = require('chance');

describe('Users - Register Users', () => {

    const chance = new Chance()
    const randomName = chance.name()
    const randomEmail = chance.email()

    it('OK - Register user successfully', () => { 
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: `${randomEmail}`,
                password: 'teste',
                administrador: 'true'
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body).to.include.all.keys('message', '_id').and.to.satisfy(body => {
                return body.message.includes('Cadastro realizado com sucesso') && typeof body._id === 'string' && body._id.length > 0
            })
        })
    })

    it('Bad Request - Invalid email format', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: `invalidEmail.com`,
                password: 'teste',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('email').includes('email deve ser um email válido')
        })
    })

    it('Bad Request - Should return error when email is already taken', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: 'fulano@qa.com',
                password: 'teste',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('message').includes('Este email já está sendo usado')
        })
    })

    it('Bad Request - Should return error when name field is missing', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: '',
                email: `${randomEmail}`,
                password: 'teste',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('nome').includes('nome não pode ficar em branco')
        })
    })

    it('Bad Request - Should return error when email field is missing', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: '',
                password: 'teste',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('email').includes('email não pode ficar em branco')
        })
    })

    it('Bad Request - Should return error when password field is missing', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: `${randomEmail}`,
                password: '',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('password').includes('password não pode ficar em branco')
        })
    })

    it('Bad Request - Should return error when administrator field is missing', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                email: `${randomEmail}`,
                password: 'teste',
                administrador: ''
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('administrador').includes("administrador deve ser 'true' ou 'false'")
        })
    })

    it('Bad Request - Registration with the nome field omitted', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                email: `${randomEmail}`,
                password: 'teste',
                administrador: 'true'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('nome').includes('nome é obrigatório')
        })
    })
        
    it('Bad Request - Registration with the email field omitted', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/usuarios`,
            body: {
                nome: `${randomName}`,
                password: 'teste',
                administrador: 'false'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('email').includes('email é obrigatório')
        })
    })
})