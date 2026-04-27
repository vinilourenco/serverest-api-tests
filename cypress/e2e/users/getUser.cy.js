describe('Users - Get Users', () => {

    const defaultId = '0uxuPY0cbmQhpEz1';
    const nonExistentUser = '0uxuPY0cbmQhpEz2';
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)

    it('OK - Verify that the user is found with a valid ID.', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/${defaultId}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('_id').includes(`${defaultId}`)
        })
    })

    it('Bad Request - Should return error if ID param is empty', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/:id`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('id').includes('id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })

    it('Bad Request - Should return error if ID param has minimum value', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/a`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('id').includes('id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })

    it('Bad Request - Should return error for strings that exceeds the normal length', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/${longText}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('id').includes('id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })

    it('Bad Request - Should return error for a non-existent user', () => {
        cy.request({
            method:'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/${nonExistentUser}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('message').includes('Usuário não encontrado')
        })
    })
})