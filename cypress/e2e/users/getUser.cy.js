import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'

describe('Users - Get Users', () => {

    const longId = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)

    it('OK - Verify that the user is found with a valid ID.', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(SEEDED_IDS.USER)
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('_id', SEEDED_IDS.USER)
        })
    })

    it('OK - Empty ID segment falls through to user list endpoint', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(''),
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.all.keys('quantidade', 'usuarios')
        })
    })

    const errorCases = [
        {
            description: 'ID param has minimum value (1 char)',
            url: () => ENDPOINTS.USER('a'),
            expected: { status: 400, message: 'id deve ter exatamente 16 caracteres alfanuméricos' },
            property: 'id'
        },
        {
            description: 'ID exceeds the normal length',
            url: () => ENDPOINTS.USER(longId),
            expected: { status: 400, message: 'id deve ter exatamente 16 caracteres alfanuméricos' },
            property: 'id'
        }
    ]

    errorCases.forEach(({ description, url, expected, property }) => {
        it(`Bad Request - Should return error if ${description}`, () => {
            cy.request({
                method: 'GET',
                url: url(),
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(expected.status)
                expect(response.body).to.have.property(property).includes(expected.message)
            })
        })
    })

    it('Bad Request - Should return error for a non-existent user', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(SEEDED_IDS.NON_EXISTENT_USER),
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('message').includes('Usuário não encontrado')
        })
    })

    it('Bad Request - Should return error for an invalid ID format', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER('{ "id": "0uxuPY0cbmQhpEz1" }'),
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('id').includes('id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })
})
