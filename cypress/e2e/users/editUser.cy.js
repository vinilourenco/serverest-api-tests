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

    it('OK - Should update user keeping the same email', () => {
        cy.editUser(`${defaultId}`, 'Nome Modificado', 'fulano@qa.com', 'novasenha123', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should update administrador value succesfully', () => {
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'false').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 when using special characters for user editing', () => {
        cy.editUser(`${defaultId}`, "Fúlano d'Sílva Jüñíor", 'fulano.especial@qa.com', 'teste123', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 when updating user with a long name', () => {
        cy.editUser(`${defaultId}`, longName, 'nome.longo@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 for email with complex domain', () => {
        cy.editUser(`${defaultId}`, 'Teste Email', 'usuario+tag@subdominio.empresa.com.br', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 for password with special characters', () => {
        cy.editUser(`${defaultId}`, 'Teste Senha', 'senha.especial@qa.com', 'S3nh@!C0mpl3x@#$%', 'false').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 if password too short (1 char)', () => {
        cy.editUser(`${defaultId}`, 'Senha Curta', 'senha.curta@qa.com.br', '1', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 if password too long', () => {
        cy.editUser(`${defaultId}`, 'Senha Longa', 'senha.longa@qa.com.br', longPassword, 'false').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    it('OK - Should return 200 if email is uppercase', () => {
        cy.editUser(`${defaultId}`, 'Email Uppercase', 'TESTE.UPPERCASE@QA.COM.BR', 'teste', 'true').then((response) => cy.editUserSuccess(response))
        cy.editUser(`${defaultId}`, 'Fulano da Silva', 'fulano@qa.com', 'teste', 'true').then((response) => cy.editUserSuccess(response))
    })

    const errorCases = [
        {
            description: 'blank space on fields',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: '  Fulano da Silva  ', email: '  fulano@qa.com  ', password: '  teste  ', administrador: 'true' },
            expected: { status: 400, message: 'email deve ser um email válido' },
            property: 'email'
        },
        {
            description: 'updating user with existent email',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId2}`,
            body: { nome: 'Usuário Duplicado', email: 'fulano@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'Este email já está sendo usado' },
            property: 'message'
        },
        {
            description: 'name field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: '', email: 'nome.vazio@qa.com', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'nome não pode ficar em branco' },
            property: 'nome'
        },
        {
            description: 'email field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: '', password: 'teste', administrador: 'true' },
            expected: { status: 400, message: 'email não pode ficar em branco' },
            property: 'email'
        },
        {
            description: 'password field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: 'senha.vazia@qa.com.br', password: '', administrador: 'false' },
            expected: { status: 400, message: 'password não pode ficar em branco' },
            property: 'password'
        },
        {
            description: 'administrador field is empty',
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`,
            body: { nome: 'Fulano da Silva', email: 'admin.vazio@qa.com.br', password: 'teste', administrador: '' },
            expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
            property: 'administrador'
        }
    ]
    
    errorCases.forEach(({ description, method, url, body, expected, property }) => {
        it(`Bad Request - Should return error when ${description}`, () => {
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