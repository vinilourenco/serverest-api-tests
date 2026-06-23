import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'
const Chance = require('chance')

describe('Users - Edit User', () => {

    const chance = new Chance()
    const longName = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)
    const longPassword = Cypress._.repeat('abcdefghijklmn10$%AMSKDKd!0i', 20)
    let randomName
    let randomEmail
    let userId

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()
    })

    afterEach(() => {
        if (userId) {
            cy.deleteUser(userId)
        }
    })

    it('OK - Should create a new user when updating unknown valid ID', () => {
        cy.editUser(SEEDED_IDS.NON_EXISTENT_USER, randomName, 'newuser@qa.com', 'novasenha123', 'true').then((response) => {
            const createdId = response.body._id
            cy.createUserViaPut(response)
            cy.deleteUser(createdId)
        })
    })

    it('OK - Should return status code 200 when updating an existent user', () => {
        cy.registerUser(randomName, randomEmail).then((response) => {
            userId = response.body._id
            cy.editUser(userId, randomName, randomEmail, 'novasenha123', 'false').then((response) => cy.editUserSuccess(response))
        })
    })

    const successCases = [
        {
            description: 'Should update user keeping the same email',
            user: { id: SEEDED_IDS.USER, nome: 'Modified Name', email: 'fulano@qa.com', password: 'novasenha123', administrador: 'true' }
        },
        {
            description: 'Should update administrador value succesfully',
            user: { id: SEEDED_IDS.USER, nome: 'Fulano da Silva', email: 'fulano@qa.com', password: 'teste', administrador: 'false' }
        },
        {
            description: 'Should return 200 when using special characters for user editing',
            user: { id: SEEDED_IDS.USER, nome: "Fúlano d'Sílva Jüñíor", email: 'fulano.special@qa.com', password: 'teste123', administrador: 'true' }
        },
        {
            description: 'Should return 200 when updating user with a long name',
            user: { id: SEEDED_IDS.USER, nome: longName, email: 'long.name@qa.com', password: 'teste', administrador: 'true' }
        },
        {
            description: 'Should return 200 for email with complex domain',
            user: { id: SEEDED_IDS.USER, nome: 'Email Test', email: 'user+tag@subdomain.enterprise.com.br', password: 'teste', administrador: 'true' }
        },
        {
            description: 'Should return 200 for password with special characters',
            user: { id: SEEDED_IDS.USER, nome: 'Password Test', email: 'special.password@qa.com', password: 'S3nh@!C0mpl3x@#$%', administrador: 'false' }
        },
        {
            description: 'Should return 200 if password too short (1 char)',
            user: { id: SEEDED_IDS.USER, nome: 'Short Password', email: 'short.password@qa.com', password: '1', administrador: 'true' }
        },
        {
            description: 'Should return 200 if password too long',
            user: { id: SEEDED_IDS.USER, nome: 'Long Password', email: 'long.password@qa.com', password: longPassword, administrador: 'false' }
        },
        {
            description: 'Should return 200 if email is uppercase',
            user: { id: SEEDED_IDS.USER, nome: 'Uppercase Email', email: 'UPPERCASE.TEST@QA.COM', password: 'teste', administrador: 'true' }
        }
    ]

    successCases.forEach(({ description, user }) => {
        it(`OK - ${description}`, () => {
            cy.editUser(user.id, user.nome, user.email, user.password, user.administrador).then((response) => cy.editUserSuccess(response))
            cy.editUser(SEEDED_IDS.USER, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        })
    })

    const errorCases = [
        {
            description: 'Should return error when blank space on fields',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: '  Fulano da Silva  ', email: '  fulano@qa.com  ', password: '  teste  ', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'Should return error when updating user with existent email',
            url: () => ENDPOINTS.USER(SEEDED_IDS.NON_EXISTENT_USER),
            body: { nome: 'Duplicated User', email: 'fulano@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'Este email já está sendo usado' },
            property: 'message'
        },
        {
            description: 'Should return error when name field is empty',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: '', email: 'empty.name@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'nome não pode ficar em branco' },
            property: 'nome'
        },
        {
            description: 'Should return error when email field is empty',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Fulano da Silva', email: '', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email não pode ficar em branco' },
            property: 'email'
        },
        {
            description: 'Should return error when password field is empty',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Fulano da Silva', email: 'empty.password@qa.com.br', password: '', administrador: 'false' },
            expected: { status: 400, message: 'password não pode ficar em branco' },
            property: 'password'
        },
        {
            description: 'Should return error when administrador field is empty',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Fulano da Silva', email: 'empty.admin@qa.com.br', password: 'teste', administrador: '' },
            expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
            property: 'administrador'
        },
        {
            description: 'Should return error when name field is missing',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { email: 'empty.admin@qa.com.br', password: 'teste', administrador: '' },
            expected: { status: 400, message: 'nome é obrigatório' },
            property: 'nome'
        },
        {
            description: 'Should return error when email field is missing',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Email Missing', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email é obrigatório' },
            property: 'email'
        },
        {
            description: 'Should return error when password field is missing',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Password Missing', email: 'without.password@qa.com', administrador: 'true' },
            expected: { status: 400, message: 'password é obrigatório' },
            property: 'password'
        },
        {
            description: 'Should return error when administrador field is missing',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Admin Missing', email: 'without.admin@qa.com', password: 'teste' },
            expected: { status: 400, message: 'administrador é obrigatório' },
            property: 'administrador'
        },
        {
            description: 'Should return error when email format is invalid',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Invalid Email', email: 'invalid_email.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'Should return error when email without domain',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Email Without Domain', email: 'user@', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'Should return error when administrador field is invalid',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Invalid Admin', email: 'invalid.admin@qa.com', password: 'teste', administrador: 'sim' },
            expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
            property: 'administrador'
        },
        {
            description: 'Should return error when email field is a boolean',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Email Boolean', email: true, password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser uma string' },
            property: 'email'
        },
        {
            description: 'Should return error when administrador field is a boolean',
            url: () => ENDPOINTS.USER(SEEDED_IDS.USER),
            body: { nome: 'Admin Boolean', email: 'admin.boolean@qa.com', password: 'teste', administrador: true },
            expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
            property: 'administrador'
        }
    ]

    errorCases.forEach(({ description, url, body, expected, property }) => {
        it(`Bad Request - ${description}`, () => {
            cy.request({
                method: 'PUT',
                url: url(),
                body,
                failOnStatusCode: false
            }).then((response) => {
                cy.badRequestWithProperty(response, property, expected.message)
            })
        })
    })

    it('Bad Request - Should return error when extra fields are send', () => {
        cy.request({
            method: 'PUT',
            url: ENDPOINTS.USER(SEEDED_IDS.USER),
            body: {
                nome: 'Campos Extras',
                email: 'extras@qa.com.br',
                password: 'teste',
                administrador: 'true',
                campoExtra: 'valor',
                outroExtra: 123
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.all.keys('campoExtra', 'outroExtra').and.to.satisfy(body => {
                return body.campoExtra.includes('campoExtra não é permitido') && body.outroExtra.includes('outroExtra não é permitido')
            })
        })
        cy.editUser(SEEDED_IDS.USER, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('Bad Request - Should return error when field values are null', () => {
        cy.request({
            method: 'PUT',
            url: ENDPOINTS.USER(SEEDED_IDS.USER),
            body: {
                nome: null,
                email: null,
                password: null,
                administrador: null
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.all.keys('nome', 'email', 'password', 'administrador').and.to.satisfy(body => {
                return body.nome.includes('nome deve ser uma string') && body.email.includes('email deve ser uma string') && body.password.includes('password deve ser uma string') && body.administrador.includes("administrador deve ser 'true' ou 'false'")
            })
        })
        cy.editUser(SEEDED_IDS.USER, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })
})
