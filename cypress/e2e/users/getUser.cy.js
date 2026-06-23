import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'

describe('Users - Get Users', () => {

    const longId = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 20)

    it('OK - Verify that the user is found with a valid ID.', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(SEEDED_IDS.USER)
        }).then((response) => {
            cy.getUserSuccess(response, SEEDED_IDS.USER)
        })
    })

    it('OK - Empty ID segment falls through to user list endpoint', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(''),
            failOnStatusCode: false
        }).then((response) => {
            cy.listUsersSuccess(response)
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
                cy.badRequestWithProperty(response, property, expected.message)
            })
        })
    })

    it('Bad Request - Should return error for a non-existent user', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER(SEEDED_IDS.NON_EXISTENT_USER),
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'message', 'Usuário não encontrado')
        })
    })

    it('Bad Request - Should return error for an invalid ID format', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USER('{ "id": "0uxuPY0cbmQhpEz1" }'),
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'id', 'id deve ter exatamente 16 caracteres alfanuméricos')
        })
    })
})
