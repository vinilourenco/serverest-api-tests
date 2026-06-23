import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'
const Chance = require('chance')

describe('User - Delete User', () => {

    const chance = new Chance()
    let randomName
    let randomEmail
    let userId

    beforeEach(() => {
        randomName = chance.name()
        randomEmail = chance.email()
    })

    it('OK - Should return status code 200 when deleting an user', () => {
        cy.registerUser(randomName, randomEmail)
            .then((response) => {
                cy.registerUserSuccess(response)
                userId = response.body._id
            })
        cy.then(() => {
            cy.request({
                method: 'DELETE',
                url: ENDPOINTS.USER(userId)
            }).then((response) => {
                cy.deleteUserSuccess(response)
            })
        })
    })

    it('OK - Should return status code 200 when deleting a non-existent user', () => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINTS.USER(SEEDED_IDS.NON_EXISTENT_USER)
        }).then((response) => {
            cy.deleteNonExistentUserSuccess(response)
        })
    })

    it('Bad Request - Should return erro when deleting user with registered cart', () => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINTS.USER(SEEDED_IDS.USER),
            failOnStatusCode: false
        }).then((response) => {
            cy.deleteUserWithCartError(response)
        })
    })
})
