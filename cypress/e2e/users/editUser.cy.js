const Chance = require('chance');

describe('Users - Edit User', () => {

    const chance = new Chance()
    const defaultId = '0uxuPY0cbmQhpEz1'
    const defaultId2 = '0uxuPY0cbmQhpEz2'
    const longName = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)
    const longPassword = Cypress._.repeat('abcdefghijklmn10$%AMSKDKd!0i', 20)
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
        cy.editUser(`${userId}`, randomName, randomEmail, 'novasenha123', 'false').then((response) => cy.editUserSuccess(response))
    })

    const succesCases =[
        {
            description: 'Should update user keeping the same email',
            user: { id: `${defaultId}`, nome: 'Modified Name', email: 'fulano@qa.com', password: 'novasenha123', administrador: 'true' }
        },
        {
            description: 'Should update administrador value succesfully',
            user: { id: `${defaultId}`, nome: 'Fulano da Silva', email: 'fulano@qa.com', password: 'teste', administrador: 'false' }
        },
        {
            description: 'Should return 200 when using special characters for user editing',
            user: { id: `${defaultId}`, nome: "Fúlano d'Sílva Jüñíor", email: 'fulano.special@qa.com', password: 'teste123', administrador: 'true' }
        },
        {
            description: 'Should return 200 when updating user with a long name',
            user: { id: `${defaultId}`, nome: longName , email: 'long.name@qa.com', password: 'teste', administrador: 'true' }
        },
        {
            description: 'Should return 200 for email with complex domain',
            user: { id: `${defaultId}`, nome: 'Email Test' , email: 'user+tag@subdomain.enterprise.com.br', password: 'teste', administrador: 'true' }
        },
        {
            description: 'Should return 200 for password with special characters',
            user: { id: `${defaultId}`, nome: 'Password Test' , email: 'special.password@qa.com', password: 'S3nh@!C0mpl3x@#$%', administrador: 'false' }
        },
        {
            description: 'Should return 200 if password too short (1 char)',
            user: { id: `${defaultId}`, nome: 'Short Password' , email: 'short.password@qa.com', password: '1', administrador: 'true' }
        },
        {
            description: 'Should return 200 if password too long',
            user: { id: `${defaultId}`, nome: 'Long Password' , email: 'long.password@qa.com', password: longPassword, administrador: 'false' }
        },
        {
            description: 'Should return 200 if email is uppercase',
            user: { id: `${defaultId}`, nome: 'Uppercase Email' , email: 'UPPERCASE.TEST@QA.COM', password: 'teste', administrador: 'true' }
        }
    ]

    succesCases.forEach(({description, user}) => {
        it(`OK - ${description}`, () => {
            cy.editUser(user.id, user.nome, user.email, user.password, user.administrador).then((response) => cy.editUserSuccess(response))
            cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        })
    })

    const errorCases = [
        {
            description: 'Should return error when blank space on fields',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: '  Fulano da Silva  ', email: '  fulano@qa.com  ', password: '  teste  ', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'Should return error when updating user with existent email',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId2}`,
            body: { nome: 'Duplicated User', email: 'fulano@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'Este email já está sendo usado' },
            property: 'message'
        },
        {
            description: 'Should return error when name field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: '', email: 'empty.name@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'nome não pode ficar em branco' },
            property: 'nome'
        },
        {
            description: 'Should return error when email field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: '', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email não pode ficar em branco' },
            property: 'email'
        },
        {
            description: 'Should return error when password field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: 'empty.password@qa.com.br', password: '', administrador: 'false' },
            expected: { status: 400, message: 'password não pode ficar em branco' },
            property: 'password'
        },
        {
            description: 'Should return error when administrador field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: 'empty.admin@qa.com.br', password: 'teste', administrador: '' },
            expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
            property: 'administrador'
        },
        {
            description: 'Should return error when name field is missing',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: {  email: 'empty.admin@qa.com.br', password: 'teste', administrador: '' },
            expected: { status: 400, message: 'nome é obrigatório' },
            property: 'nome'
        },
        {
            description: 'Should return error when email field is missing',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Email Missing', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email é obrigatório' },
            property: 'email'
        },
        {
            description: 'Should return error when password field is missing',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Password Missing', email: 'without.password@qa.com', administrador: 'true' },
            expected: { status: 400, message: 'password é obrigatório' },
            property: 'password'
        },
        {
            description: 'Should return error when administrador field is missing',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Admin Missing', email: 'without.admin@qa.com', password: 'teste', },
            expected: { status: 400, message: 'administrador é obrigatório' },
            property: 'administrador'
        },
        {
            description: 'Should return error when email format is invalid',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Invalid Email', email: 'invalid_email.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'Should return error when email without domain',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Email Without Domain', email: 'user@', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        }
    ]
    
    errorCases.forEach(({ description, method, url, body, expected, property }) => {
        it(`Bad Request - ${description}`, () => {
            cy.request({
                method,
                url,
                body,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(expected.status)
                expect(response.body).to.have.property(property).includes(expected.message)
            })
            cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        })
    })
})