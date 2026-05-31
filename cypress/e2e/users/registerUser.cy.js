const Chance = require('chance');

describe('Users - Register Users', () => {

    const chance = new Chance()
    let randomName
    let randomEmail
    let userId

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()
        const errorCases = [
            {
                description: 'invalid email format',
                body: { nome: `${randomName}`, email: 'invalidEmail.com', password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'email deve ser um email válido' },
                property: 'email'
            },
            {
                description: 'email already taken',
                body: { nome: `${randomName}`, email: 'fulano@qa.com', password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'Este email já está sendo usado' },
                property: 'message'
            },
            {
                description: 'name field is missing',
                body: { nome: '', email: `${randomEmail}`, password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'nome não pode ficar em branco' },
                property: 'nome'
            },
            {
                description: 'email field is missing',
                body: { nome: `${randomName}`, email: '', password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'email não pode ficar em branco' },
                property: 'email'
            },
            {
                description: 'password field is missing',
                body: { nome: `${randomName}`, email: `${randomEmail}`, password: '', administrador: 'true' },
                expected: { status: 400, message: 'password não pode ficar em branco' },
                property: 'password'
            },
            {
                description: 'administrator field is missing',
                body: { nome: `${randomName}`, email: `${randomEmail}`, password: 'teste', administrador: '' },
                expected: { status: 400, message: "administrador deve ser 'true' ou 'false'" },
                property: 'administrador'
            },
            {
                description: 'nome field omitted',
                body: { email: `${randomEmail}`, password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'nome é obrigatório' },
                property: 'nome'
            },
            {
                description: 'email field omitted',
                body: { nome: `${randomName}`, password: 'teste', administrador: 'true' },
                expected: { status: 400, message: 'email é obrigatório' },
                property: 'email'
            },
            {
                description: 'password field omitted',
                body: { nome: `${randomName}`, email: `${randomEmail}`, administrador: 'true' },
                expected: { status: 400, message: 'password é obrigatório' },
                property: 'password'
            },
            {
                description: 'administrador field omitted',
                body: { nome: `${randomName}`, email: `${randomEmail}`, password: 'true' },
                expected: { status: 400, message: 'administrador é obrigatório' },
                property: 'administrador'
            }
        ]
    })

    afterEach(() => {
        if (userId) {
            cy.request('DELETE', `${Cypress.config('baseUrl')}/usuarios/${userId}`)
        }
    })

    it('OK - Register user successfully', () => {
        cy.registerUser(randomName, randomEmail).then((response) => {
            userId = response.body._id
            expect(response.status).to.equal(201)
            expect(response.body).to.include.all.keys('message', '_id').and.to.satisfy(body => {
                return body.message.includes('Cadastro realizado com sucesso') && typeof body._id === 'string' && body._id.length > 0
            })
        })
    })


    errorCases.forEach(({ description, body, expected, property }) => {
        it(`Bad Request - Should return error when ${description}`, () => {
            cy.request({
                method: 'POST',
                url: `${Cypress.config('baseUrl')}/usuarios`,
                body,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(expected.status)
                expect(response.body).to.have.property(property).includes(expected.message)
            })
        })
    })
})