describe('Users - List Users', () => {

    const user = {
        nome: 'Fulano da Silva',
        email: 'beltrano@qa.com.br',
        password: 'teste',
        administrador: true,
        _id: '0uxuPY0cbmQhpEz1'
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

    it('OK - Filtering by existing ID', () => {
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

    it('OK - Filtering by existing name', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios?nome=${user.nome}`
        }).then((response) => {
            expect(response.body).to.have.property('usuarios').that.is.an('array').and.is.not.empty
        })
    })
}) 