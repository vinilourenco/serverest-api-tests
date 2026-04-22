describe('Users - List Users', () => {

    const user = {
        nome: 'Teste',
        email: 'fulano@qa.com',
        password: '123456',
        administrador: false,
        _id: '3hqQqD7ChRI5M2Im'
    }

    it('Should list all users', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include.all.keys('quantidade', 'usuarios')
        })
    })

    it.only('OK - Filtering by existing ID', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios?_id=${user._id}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('quantidade', 1)
            expect(response.body).to.have.property('usuarios')
                .that.is.an('array')
                .and.is.not.empty
            expect(response.body.usuarios[0]).to.have.property('_id', user._id)
        })
    })
}) 