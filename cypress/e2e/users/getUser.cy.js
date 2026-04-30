describe('Users - Get Users', () => {

    const defaultId = '0uxuPY0cbmQhpEz1';
    const nonExistentUser = '0uxuPY0cbmQhpEz2';
    const invalidFormatId = '{ "id": "0uxuPY0cbmQhpEz1" }'
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

    const errorCases = [
        {
            description: 'ID param is empty',
            expected: { status: 400, message: 'id deve ter exatamente 16 caracteres alfanuméricos' },
            property: 'id'
        },
        {
            description: 'ID param has minimum value',
            expected: { status: 400, message: 'id deve ter exatamente 16 caracteres alfanuméricos' },
            property: 'id'
        },
        {
            description: 'strings that exceeds the normal length',
            expected: { status: 400, message: 'id deve ter exatamente 16 caracteres alfanuméricos' },
            property: 'id'
        }
    ]

    errorCases.forEach(({ description, expected, property }) => {
        it(`Bad Request - Should return error if ${description}`, () => {
            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}/usuarios/:id`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(expected.status)
                expect(response.body).to.have.property(property).includes(expected.message)
            })
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

    it('Bad Request - Should return error for an invalid ID format', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/usuarios/${invalidFormatId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('id').includes('id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })
})