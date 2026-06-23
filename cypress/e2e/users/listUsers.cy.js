import { ENDPOINTS, SEEDED_IDS } from '../../support/constants'
const Chance = require('chance')

describe('Users - List Users', () => {

    const chance = new Chance()
    const randomName = chance.name()
    const user = {
        nome: 'Fulano da Silva',
        email: 'fulano@qa.com',
        password: 'teste',
        administrador: 'true',
        _id: SEEDED_IDS.USER
    }

    it('Should list all users', () => {
        cy.request({
            method: 'GET',
            url: ENDPOINTS.USERS
        }).then((response) => {
            cy.listUsersSuccess(response)
        })
    })

    it('OK - Filtering by existing ID', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?_id=${user._id}`
        }).then((response) => {
            cy.listUsersWithResults(response)
            expect(response.body).to.have.property('quantidade', 1)
            expect(response.body.usuarios[0]).to.have.property('_id', user._id)
        })
    })

    it('OK - Filtering by existing name', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?nome=${user.nome}`
        }).then((response) => {
            cy.listUsersWithResults(response)
        })
    })

    it('OK - Filtering by existing email', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?email=${user.email}`
        }).then((response) => {
            cy.listUsersWithResults(response)
            expect(response.body.usuarios[0]).to.have.property('email', user.email)
        })
    })

    it('OK - Filtering by administrator', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?administrador=${user.administrador}`
        }).then((response) => {
            cy.listUsersWithResults(response)
            expect(response.body.usuarios[0]).to.have.property('administrador', user.administrador)
        })
    })

    it('OK - Filtering by non-existing email', () => {
        const randomEmail = chance.email()

        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?email=${randomEmail}`
        }).then((response) => {
            cy.listUsersEmpty(response)
        })
    })

    it('OK - Filtering by non-existent name', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?nome=${randomName}`
        }).then((response) => {
            cy.listUsersEmpty(response)
        })
    })

    it('Bad Request - Invalid param', () => {
        cy.request({
            method: 'GET',
            url: `${ENDPOINTS.USERS}?invalidParam=value`,
            failOnStatusCode: false
        }).then((response) => {
            cy.badRequestWithProperty(response, 'invalidParam', 'invalidParam não é permitido')
        })
    })
})
